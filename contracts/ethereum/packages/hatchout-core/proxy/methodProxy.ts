import MethodFactory from "../factories/methodFactory";

export default class MethodProxy {
  constructor(target, methodFactory: MethodFactory) {
    return new Proxy(target, {
      get: (target, name) => {
        const method = methodFactory.createMethod(name);
        if (method === undefined) {
          throw new Error('method does not exist')
        }

        function RpcMethod() {
          return method.execute(arguments);
        }

        /* eslint-enable no-inner-declarations */
        RpcMethod.method = method;
        RpcMethod.request = function () {
          return method;
        };

        return RpcMethod;
      }
    });
  }
}