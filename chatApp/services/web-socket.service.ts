import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  listen<T>(eventName: string): Observable<T> {
    return this.socket.fromEvent<T>(eventName);
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
