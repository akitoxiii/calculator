type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  private addLog(level: LogLevel, message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: this.formatDate(new Date()),
      level,
      message,
      data,
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 本番環境では適切なログ管理サービスに送信
    if (process.env.NODE_ENV === 'production') {
      // TODO: 本番環境用のログ送信処理を実装
      // 例: Sentry, LogRocket, CloudWatchなど
    }

    // 開発環境ではコンソールに出力
    if (process.env.NODE_ENV === 'development') {
      console[level](message, data);
    }
  }

  info(message: string, data?: any) {
    this.addLog('info', message, data);
  }

  warn(message: string, data?: any) {
    this.addLog('warn', message, data);
  }

  error(message: string, data?: any) {
    this.addLog('error', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 