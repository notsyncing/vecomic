import { Injectable } from "@angular/core";

@Injectable()
export class StateManager {
  constructor() {
  }

  private prefixKey(key: string): string {
    return `vc-state.${key}`;
  }

  get(key: string): string {
    return localStorage.getItem(this.prefixKey(key));
  }

  getObject<T>(key: string): T {
    return JSON.parse(this.get(key)) as T;
  }

  put(key: string, value: any): void {
    localStorage.setItem(this.prefixKey(key), value);
  }

  putObject(key: string, obj: any): void {
    this.put(key, JSON.stringify(obj));
  }

  remove(key: string): any {
    const value = localStorage.getItem(this.prefixKey(key));
    localStorage.removeItem(this.prefixKey(key));
    return value;
  }

  hasKey(key: string): boolean {
    return localStorage.getItem(this.prefixKey(key)) != null;
  }
}
