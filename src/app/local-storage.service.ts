import { LocalStorage } from '@ngx-pwa/local-storage';
import { Inject, Injectable, InjectionToken  } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});


@Injectable()
export class LocalStorageService {

  constructor(
    protected localStorage: LocalStorage,
    @Inject(BROWSER_STORAGE) public storage: Storage
  ) {}

  get(key: string) {
    this.storage.getItem(key);
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

}
