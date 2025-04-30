import { supabase } from './supabase';
import { logger } from './logger';

interface BackupData {
  timestamp: string;
  tables: {
    [tableName: string]: any[];
  };
}

export class BackupService {
  private static instance: BackupService;
  private readonly tables = ['expenses', 'categories', 'assets'];

  private constructor() {}

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  async createBackup(): Promise<BackupData | null> {
    try {
      const timestamp = new Date().toISOString();
      const tables: { [key: string]: any[] } = {};

      for (const table of this.tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*');

        if (error) {
          throw error;
        }

        tables[table] = data;
      }

      const backup: BackupData = {
        timestamp,
        tables,
      };

      // バックアップデータをローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastBackup', JSON.stringify(backup));
      }

      // 本番環境では適切なストレージサービスにバックアップを保存
      if (process.env.NODE_ENV === 'production') {
        // TODO: 本番環境用のバックアップ保存処理を実装
        // 例: AWS S3, Google Cloud Storage など
      }

      logger.info('Backup created successfully', { timestamp });
      return backup;
    } catch (error) {
      logger.error('Failed to create backup', error);
      return null;
    }
  }

  async restoreFromBackup(backup: BackupData): Promise<boolean> {
    try {
      for (const [table, data] of Object.entries(backup.tables)) {
        // 既存のデータを削除
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .neq('id', 0); // ダミー条件（全件削除）

        if (deleteError) {
          throw deleteError;
        }

        // バックアップデータを挿入
        const { error: insertError } = await supabase
          .from(table)
          .insert(data);

        if (insertError) {
          throw insertError;
        }
      }

      logger.info('Backup restored successfully', { timestamp: backup.timestamp });
      return true;
    } catch (error) {
      logger.error('Failed to restore backup', error);
      return false;
    }
  }

  getLastBackup(): BackupData | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const backup = localStorage.getItem('lastBackup');
    return backup ? JSON.parse(backup) : null;
  }
}

export const backupService = BackupService.getInstance(); 