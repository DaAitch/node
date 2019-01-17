'use strict';

const common = require('../../common');
const assert = require('assert');
const {callbackOnThreads} = require(`./build/${common.buildType}/binding`);

// we want some sync and deferred calls
test(1);
test(2);
test(4);
test(8);
test(16);
test(32);
// test(2);
// test(4);
// test(8);
// test(104);
// test(32);
// test(64);
// test(128);
// test(256);

// setTimeout(common.mustCall(() => {
//   testSome(2);
//   setImmediate(common.mustCall(() => {
//     testSome(3);
//     process.nextTick(common.mustCall(() => {
//       testSome(4);
//     }));
//   }));
// }), 10); // 10ms

// just to exclude, that loop is early terminating
// setTimeout(() => {}, 3000);

function testSome(i) {
  test(i * 1);
  test(i * 10);
}

function test(threadCount) {
  const result = [];
  
  const validator = common.mustCall(() => {
    console.log({threadCount});
    result.sort();
    const expected = [];
    for (let j = 0; j < threadCount; j++) {
      expected[j] = j;
    }

    assert.deepStrictEqual(result, expected);
  });

  const callback = common.mustCall(i => {
    result.push(i);
    console.log({threadCount, length: result.length});
    if (result.length === threadCount) {
      validator();
    }
  }, threadCount);

  callbackOnThreads(threadCount, callback);
}

// Debug:
/*
  thread_count: 1
  Thread i: 0 detached
  thread_count: 10
  Thread i: 0 detached
  Thread i: 1 detached
  Thread i: 2 detached
  Thread i: 3 detached
  Thread i: 4 detached
  Thread i: 5 detached
  Thread i: 6 detached
  Thread i: 7 detached
  Thread i: 8 detached
  Thread i: 9 detached
  i: 9
  Thread for i: 9 terminates
  i: 8
  Thread for i: 8 terminates
  i: 7
  Thread for i: 7 terminates
  i: 6
  Thread for i: 6 terminates
  i: 5
  Thread for i: 5 terminates
  i: 4
  Thread for i: 4 terminates
  i: 3
  Thread for i: 3 terminates
  i: 2
  Thread for i: 2 terminates
  i: 1
  Thread for i: 1 terminates
  i: 0
  { threadCount: 10 }
  Thread for i: 0 terminates
  i: 0
  { threadCount: 1 }
  Thread for i: 0 terminates
  thread_count: 2
  Thread i: 0 detached
  Thread i: 1 detached
  thread_count: 20
  Thread i: 0 detached
  Thread i: 1 detached
  Thread i: 2 detached
  Thread i: 3 detached
  Thread i: 4 detached
  Thread i: 5 detached
  Thread i: 6 detached
  Thread i: 7 detached
  Thread i: 8 detached
  Thread i: 9 detached
  Thread i: 10 detached
  Thread i: 11 detached
  Thread i: 12 detached
  Thread i: 13 detached
  Thread i: 14 detached
  Thread i: 15 detached
  Thread i: 16 detached
  Thread i: 17 detached
  Thread i: 18 detached
  Thread i: 19 detached
  thread_count: 3
  Thread i: 0 detached
  Thread i: 1 detached
  Thread i: 2 detached
  thread_count: 30
  Thread i: 0 detached
  Thread i: 1 detached
  Thread i: 2 detached
  Thread i: 3 detached
  Thread i: 4 detached
  Thread i: 5 detached
  Thread i: 6 detached
  Thread i: 7 detached
  Thread i: 8 detached
  Thread i: 9 detached
  Thread i: 10 detached
  Thread i: 11 detached
  Thread i: 12 detached
  Thread i: 13 detached
  Thread i: 14 detached
  Thread i: 15 detached
  Thread i: 16 detached
  Thread i: 17 detached
  Thread i: 18 detached
  Thread i: 19 detached
  Thread i: 20 detached
  Thread i: 21 detached
  Thread i: 22 detached
  Thread i: 23 detached
  Thread i: 24 detached
  Thread i: 25 detached
  Thread i: 26 detached
  Thread i: 27 detached
  Thread i: 28 detached
  Thread i: 29 detached
  thread_count: 4
  Thread i: 0 detached
  Thread i: 1 detached
  Thread i: 2 detached
  Thread i: 3 detached
  thread_count: 40
  Thread i: 0 detached
  Thread i: 1 detached
  Thread i: 2 detached
  Thread i: 3 detached
  Thread i: 4 detached
  Thread i: 5 detached
  Thread i: 6 detached
  Thread i: 7 detached
  Thread i: 8 detached
  Thread i: 9 detached
  Thread i: 10 detached
  Thread i: 11 detached
  Thread i: 12 detached
  Thread i: 13 detached
  Thread i: 14 detached
  Thread i: 15 detached
  Thread i: 16 detached
  Thread i: 17 detached
  Thread i: 18 detached
  Thread i: 19 detached
  Thread i: 20 detached
  Thread i: 21 detached
  Thread i: 22 detached
  Thread i: 23 detached
  Thread i: 24 detached
  Thread i: 25 detached
  Thread i: 26 detached
  Thread i: 27 detached
  Thread i: 28 detached
  Thread i: 29 detached
  Thread i: 30 detached
  Thread i: 31 detached
  Thread i: 32 detached
  Thread i: 33 detached
  Thread i: 34 detached
  Thread i: 35 detached
  Thread i: 36 detached
  Thread i: 37 detached
  Thread i: 38 detached
  Thread i: 39 detached
  i: 19
  Thread for i: 19 terminates
  i: 18
  Thread for i: 18 terminates
  i: 17
  Thread for i: 17 terminates
  i: 16
  Thread for i: 16 terminates
  i: 15
  Thread for i: 15 terminates
  i: 14
  Thread for i: 14 terminates
  i: 13
  Thread for i: 13 terminates
  i: 12
  Thread for i: 12 terminates
  i: 11
  Thread for i: 11 terminates
  i: 10
  Thread for i: 10 terminates
  i: 9
  Thread for i: 9 terminates
  i: 8
  Thread for i: 8 terminates
  i: 7
  Thread for i: 7 terminates
  i: 6
  Thread for i: 6 terminates
  i: 5
  Thread for i: 5 terminates
  i: 4
  Thread for i: 4 terminates
  i: 3
  Thread for i: 3 terminates
  i: 2
  Thread for i: 2 terminates
  i: 1
  Thread for i: 1 terminates
  i: 0
  { threadCount: 20 }
  i: 1
  i: 0
  i: 39
  i: 38
  i: 37
  i: 36
  i: 35
  i: 34
  i: 33
  i: 32
  i: 31
  i: 30
  i: 29
  i: 28
  i: 27
  i: 26
  i: 25
  i: 24
  i: 23
  i: 22
  i: 21
  i: 20
  i: 19
  i: 18
  i: 17
  i: 16
  i: 15
  i: 14
  i: 13
  i: 12
  i: 11
  i: 10
  i: 9
  i: 8
  i: 7
  i: 6
  i: 5
  i: 4
  i: 3
  i: 2
  i: 1
  i: 0
  i: 3
  i: 2
  i: 1
  i: 0
  i: 29
  i: 28
  i: 27
  i: 26
  i: 25
  i: 24
  i: 23
  i: 22
  i: 21
  i: 20
  i: 19
  i: 18
  i: 17
  i: 16
  i: 15
  i: 14
  i: 13
  i: 12
  i: 11
  i: 10
  i: 9
  i: 8
  i: 7
  i: 6
  i: 5
  i: 4
  i: 3
  i: 2
  i: 1
  i: 0
  i: 2
  i: 1
  i: 0
  Mismatched <anonymous> function calls. Expected exactly 1, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:32:28)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:24:3)
      at Timeout.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:11:3)
      at Timeout._onTimeout (/home/aitch/Code/node/test/common/index.js:376:15)
      at listOnTimeout (timers.js:324:15)
      at processTimers (timers.js:268:5)
  Mismatched <anonymous> function calls. Expected exactly 2, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:43:27)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:24:3)
      at Timeout.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:11:3)
      at Timeout._onTimeout (/home/aitch/Code/node/test/common/index.js:376:15)
      at listOnTimeout (timers.js:324:15)
      at processTimers (timers.js:268:5)
  Mismatched <anonymous> function calls. Expected exactly 1, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:32:28)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:24:3)
      at Immediate.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:13:5)
      at Immediate._onImmediate (/home/aitch/Code/node/test/common/index.js:376:15)
      at processImmediate (timers.js:632:19)
  Mismatched <anonymous> function calls. Expected exactly 3, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:43:27)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:24:3)
      at Immediate.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:13:5)
      at Immediate._onImmediate (/home/aitch/Code/node/test/common/index.js:376:15)
      at processImmediate (timers.js:632:19)
  Mismatched <anonymous> function calls. Expected exactly 1, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:32:28)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:25:3)
      at Immediate.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:13:5)
      at Immediate._onImmediate (/home/aitch/Code/node/test/common/index.js:376:15)
      at processImmediate (timers.js:632:19)
  Mismatched <anonymous> function calls. Expected exactly 30, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:43:27)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:25:3)
      at Immediate.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:13:5)
      at Immediate._onImmediate (/home/aitch/Code/node/test/common/index.js:376:15)
      at processImmediate (timers.js:632:19)
  Mismatched <anonymous> function calls. Expected exactly 1, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:32:28)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:24:3)
      at process.nextTick.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:15:7)
      at /home/aitch/Code/node/test/common/index.js:376:15
      at process.internalTickCallback (internal/process/next_tick.js:67:9)
  Mismatched <anonymous> function calls. Expected exactly 4, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:43:27)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:24:3)
      at process.nextTick.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:15:7)
      at /home/aitch/Code/node/test/common/index.js:376:15
      at process.internalTickCallback (internal/process/next_tick.js:67:9)
  Mismatched <anonymous> function calls. Expected exactly 1, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:32:28)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:25:3)
      at process.nextTick.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:15:7)
      at /home/aitch/Code/node/test/common/index.js:376:15
      at process.internalTickCallback (internal/process/next_tick.js:67:9)
  Mismatched <anonymous> function calls. Expected exactly 40, actual 0.
      at Object.mustCall (/home/aitch/Code/node/test/common/index.js:342:10)
      at test (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:43:27)
      at testSome (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:25:3)
      at process.nextTick.common.mustCall (/home/aitch/Code/node/test/node-api/test_threadsafe_callback/test.js:15:7)
      at /home/aitch/Code/node/test/common/index.js:376:15
      at process.internalTickCallback (internal/process/next_tick.js:67:9)
 */