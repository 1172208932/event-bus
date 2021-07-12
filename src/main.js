/**
 * 通信中心
 */
 import EventObject from './EventObject.js';

class EventCenterClass {
    constructor(){
        this._listeners= null
    }
    /**
    * @language=zh
    * 增加一个事件监听。
    * @param {String} type 要监听的事件类型。
    * @param {Function} listener 事件监听回调函数。
    * @param context 上下文
    * @param {Boolean} once 是否是一次性监听，即回调函数响应一次后即删除，不再响应。
    * @returns {Object} 对象本身。链式调用支持。
    */
   on(type, listener,context, once) {
     let listeners;
     listener=listener.bind(context)
     if (this.hasOwnProperty('_listeners')) {
       listeners = (this._listeners = this._listeners || {});
     } else {
       listeners = (this.__proto__.__proto__._listeners = this.__proto__.__proto__._listeners || {});
     }
     // const listeners = (this.__proto__.__proto__._listeners = this.__proto__.__proto__._listeners || {});
     const eventListeners = (listeners[type] = listeners[type] || []);
     for (let i = 0, len = eventListeners.length; i < len; i++) {
       const el = eventListeners[i];
       if (el.listener === listener) return;
     }
     eventListeners.push({ listener, once });
     return this;
   }
 
   /**
    * @language=zh
    * 删除一个事件监听。如果不传入任何参数，则删除所有的事件监听；如果不传入第二个参数，则删除指定类型的所有事件监听。
    * @param {String} type 要删除监听的事件类型。
    * @param {Function} listener 要删除监听的回调函数。
    * @returns {Object} 对象本身。链式调用支持。
    */
   off(type, listener) {
     let listeners;
     if (this.hasOwnProperty('_listeners')) {
       listeners = (this._listeners = this._listeners || {});
     } else {
       listeners = (this.__proto__.__proto__._listeners = this.__proto__.__proto__._listeners || {});
     }
     // remove all event listeners
     if (arguments.length == 0) {
       listeners = null;
       return this;
     }
 
     const eventListeners = listeners && listeners[type];
     if (eventListeners) {
       // remove event listeners by specified type
       if (arguments.length == 1) {
         delete listeners[type];
         return this;
       }
 
       for (let i = 0, len = eventListeners.length; i < len; i++) {
         const el = eventListeners[i];
         if (el.listener === listener) {
           eventListeners.splice(i, 1);
           if (eventListeners.length === 0) delete listeners[type];
           break;
         }
       }
     }
     return this;
   }
 
   /**
    * @language=zh
    * 发送事件。当第一个参数类型为Object时，则把它作为一个整体事件对象。
    * @param {String} type 要发送的事件类型。
    * @param {Object} detail 要发送的事件的具体信息，即事件随带参数。
    * @returns {Boolean} 是否成功调度事件。
    */
   fire(type, detail) {
     let event; let
       eventType;
     if (typeof type === 'string') {
       eventType = type;
     } else {
       event = type;
       eventType = type.type;
     }
     const listeners = this._listeners;
     if (!listeners) return false;
 
     const eventListeners = listeners[eventType];
     if (eventListeners) {
       const eventListenersCopy = eventListeners.slice(0);
       event = event || new EventObject(eventType, this, detail);
       if (event._stopped) return false;
 
       for (let i = 0; i < eventListenersCopy.length; i++) {
         const el = eventListenersCopy[i];
         el.listener.call(this, event);
         if (el.once) {
           const index = eventListeners.indexOf(el);
           if (index > -1) {
             eventListeners.splice(index, 1);
           }
         }
       }
 
       if (eventListeners.length == 0) delete listeners[eventType];
       return true;
     }
     return false;
   }
}

export default new EventCenterClass();