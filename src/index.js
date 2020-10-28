import Mixin from './mixin';
import Logger from './logger';
import Listener from './listener';
import Emitter from './emitter';
import SocketIO from 'socket.io-client';

export default class VueSocketIO {

    /**
     * lets take all resource
     * @param io
     * @param vuex
     * @param debug
     * @param options
     */
    constructor({connection, vuex, debug, options}){

        Logger.debug = debug;
        this.io = this.connect(connection, options);

        // change for init later
        if (this.io) {
            this.emitter = new Emitter(vuex);
            this.listener = new Listener(this.io, this.emitter);
        } else {
            this.initSocket.connection = connection;
            this.initSocket.vuex = vuex;
            this.initSocket.options = options;
        }
    }

    /**
     * Vue.js entry point
     * @param Vue
     */
    install(Vue){

        Vue.prototype.$socket = this.io;
        Vue.prototype.$vueSocketIo = this;
        Vue.mixin(Mixin);

        Logger.info('Vue-Socket.io plugin enabled');

    }

    /**
     * install io, modif by bango
     */
    initSocket() {
        if (!this.io) {
            this.io = SocketIO(this.initSocket.connection, this.initSocket.options);
            this.emitter = new Emitter(this.initSocket.vuex);
            this.listener = new Listener(this.io, this.emitter);
            this.initSocket.connection = null;
            this.initSocket.vuex = null;
            this.initSocket.options = null;
        }
        return this.io
    }


    /**
     * registering SocketIO instance
     * @param connection
     * @param options
     */
    connect(connection, options){

        if(connection && typeof connection === 'object'){

            Logger.info('Received socket.io-client instance');

            return connection;

        } else if(typeof connection === 'string'){

            Logger.info('Received connection string...');

            // return this.io = SocketIO(connection, options);
            return null;
        } else {

            Logger.info('connect err:', {connection, options});
            throw new Error('Unsupported connection type');

        }

    }

}
