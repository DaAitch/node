#define NAPI_EXPERIMENTAL
#include <node_api.h>
#include <future>
#include <chrono>
#include <iostream>
#include "../../js-native-api/common.h"

// callbackOnThreads(20, i => { /* ... */ });
static napi_value CallbackOnThreads(napi_env env, napi_callback_info info) {
  // vvv Node Thread vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  size_t argc = 2;
  napi_value argv[2];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr));

  NAPI_ASSERT(env, argc == 2, "need 2 args");
  
  int32_t thread_count;
  NAPI_CALL(env, napi_get_value_int32(env, argv[0], &thread_count));
  std::cout << "thread_count: " << thread_count << std::endl;

  napi_value resource_name;
  NAPI_CALL(env, napi_create_string_latin1(env, "threadsafe_callback",
                                           NAPI_AUTO_LENGTH, &resource_name));

  // napi_async_context async_context;
  // NAPI_CALL(env, napi_async_init(env, nullptr, resource_name,
  //                                &async_context));

  for (int i = 0; i < thread_count; i++) {
    napi_ref callback_ref;
    NAPI_CALL(env, napi_create_reference(env, argv[1], 1, &callback_ref));

    napi_threadsafe_callback ts_cb;
    NAPI_CALL(env, napi_create_threadsafe_callback(env, nullptr, // TODO
                                                   &ts_cb));

    std::async(std::launch::async, [i, callback_ref, ts_cb]() -> void {
      // ^^^ Node Thread ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // vvv 2nd Thread vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      struct data_t {
        int i = 0;
        napi_ref callback_ref;
      };

      {
        using namespace std::chrono_literals;
        // heavy sleeping here
        std::this_thread::sleep_for(50ms);
      }

      napi_status status;
      status = napi_make_threadsafe_callback(ts_cb, new data_t{i, callback_ref},
                                             [](napi_env env, void* data) {
        // ^^^ 2nd Thread ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // vvv Node Thread vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        data_t* d = static_cast<data_t*>(data);

        std::cout << "i: " << d->i << std::endl;

        napi_value callback;
        NAPI_CALL_RETURN_VOID(env, napi_get_reference_value(env,
                                                            d->callback_ref,
                                                            &callback));
        napi_value global;
        NAPI_CALL_RETURN_VOID(env, napi_get_global(env, &global));

        napi_value i;
        NAPI_CALL_RETURN_VOID(env, napi_create_int32(env, d->i, &i));
        NAPI_CALL_RETURN_VOID(env, napi_call_function(env, global, callback,
                                                      1, &i, nullptr));

        NAPI_CALL_RETURN_VOID(env, napi_reference_unref(env, d->callback_ref,
                                                        nullptr));
        // ^^^ Node Thread ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        std::cout << "Thread for i: " << d->i << " terminates" << std::endl;
        delete d;
        // vvv 2nd Thread vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      });

      if (status != napi_ok) {
        napi_fatal_error("threadsafe thread", NAPI_AUTO_LENGTH,
                         "napi_make_threadsafe_callback failed",
                         NAPI_AUTO_LENGTH);
      }
    });
    std::cout << "Thread i: " << i << " detached" << std::endl;
  }

  napi_value undefined;
  NAPI_CALL(env, napi_get_undefined(env, &undefined));
  return undefined;
}

static
napi_value Init(napi_env env, napi_value exports) {
  napi_value fn;
  NAPI_CALL(env, napi_create_function(
      env, nullptr, NAPI_AUTO_LENGTH, CallbackOnThreads, nullptr, &fn));
  NAPI_CALL(env, napi_set_named_property(env, exports,
                                         "callbackOnThreads", fn));
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
