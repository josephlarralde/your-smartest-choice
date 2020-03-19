'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Definition of the content used in the view of `Activity` instances. The key
// of the returned object match the id of the activities.
//
// Each content defines the variables that are used inside the corresponding
// [`template`]{@link module soundworks/client.defaultViewTemplates}. A special
// key `globals` is accessible among all templates and can then be used to share
// variables among all the views of the application.
// These objects are used to populate the templates declared inside the
// `~/src/client/shared/viewTemplate.js` file.
exports.default = {
  // variables shared among all templates through the global namespace
  'globals': {},

  // content of the `auth` service
  'service:auth': {
    instructions: 'Login',
    send: 'Send',
    reset: 'Reset',
    rejectMessage: 'Sorry, you don\'t have access to this client',
    rejected: false
  },

  // content of the `checkin` service
  'service:checkin': {
    labelPrefix: 'Go to',
    labelPostfix: 'Touch the screen<br class="portrait-only" />when you are ready.',
    error: false,
    errorMessage: 'Sorry,<br/>no place available',
    wait: 'Please wait...',
    label: ''
  },

  // content of the `loader` service
  'service:loader': {
    loading: 'Loading sounds…'
  },

  // content of the `locator` service
  'service:locator': {
    instructions: 'Define your position in the area',
    send: 'Send',
    showBtn: false
  },

  // content of the `placer` service
  'service:placer': {
    instructions: 'Select your position',
    send: 'Send',
    reject: 'Sorry, no place is available',
    showBtn: false,
    rejected: false
  },

  // content of the `platform` service
  'service:platform': {
    isCompatible: null,
    errorMessage: 'Sorry,<br />Your device is not compatible with this application.',
    intro: 'Welcome to',
    instructions: 'Touch the screen to join !'
  },

  // content of the `sync` service
  'service:sync': {
    wait: 'Clock syncing,<br />stand by&hellip;'
  },

  // content of the `survey` scene
  'survey': {
    next: 'Next',
    validate: 'Validate',
    thanks: 'Thanks!',
    length: '-'
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdDb250ZW50LmpzIl0sIm5hbWVzIjpbImluc3RydWN0aW9ucyIsInNlbmQiLCJyZXNldCIsInJlamVjdE1lc3NhZ2UiLCJyZWplY3RlZCIsImxhYmVsUHJlZml4IiwibGFiZWxQb3N0Zml4IiwiZXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJ3YWl0IiwibGFiZWwiLCJsb2FkaW5nIiwic2hvd0J0biIsInJlamVjdCIsImlzQ29tcGF0aWJsZSIsImludHJvIiwibmV4dCIsInZhbGlkYXRlIiwidGhhbmtzIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtrQkFDZTtBQUNiO0FBQ0EsYUFBVyxFQUZFOztBQUliO0FBQ0Esa0JBQWdCO0FBQ2RBLGtCQUFjLE9BREE7QUFFZEMsVUFBTSxNQUZRO0FBR2RDLFdBQU8sT0FITztBQUlkQyxpRUFKYztBQUtkQyxjQUFVO0FBTEksR0FMSDs7QUFhYjtBQUNBLHFCQUFtQjtBQUNqQkMsaUJBQWEsT0FESTtBQUVqQkMsa0JBQWMsaUVBRkc7QUFHakJDLFdBQU8sS0FIVTtBQUlqQkMsa0JBQWMsK0JBSkc7QUFLakJDLFVBQU0sZ0JBTFc7QUFNakJDLFdBQU87QUFOVSxHQWROOztBQXVCYjtBQUNBLG9CQUFrQjtBQUNoQkMsYUFBUztBQURPLEdBeEJMOztBQTRCYjtBQUNBLHFCQUFtQjtBQUNqQlgsa0JBQWMsa0NBREc7QUFFakJDLFVBQU0sTUFGVztBQUdqQlcsYUFBUztBQUhRLEdBN0JOOztBQW1DYjtBQUNBLG9CQUFrQjtBQUNoQlosa0JBQWMsc0JBREU7QUFFaEJDLFVBQU0sTUFGVTtBQUdoQlksWUFBUSw4QkFIUTtBQUloQkQsYUFBUyxLQUpPO0FBS2hCUixjQUFVO0FBTE0sR0FwQ0w7O0FBNENiO0FBQ0Esc0JBQW9CO0FBQ2xCVSxrQkFBYyxJQURJO0FBRWxCTixrQkFBYyxrRUFGSTtBQUdsQk8sV0FBTyxZQUhXO0FBSWxCZixrQkFBYztBQUpJLEdBN0NQOztBQW9EYjtBQUNBLGtCQUFnQjtBQUNkUztBQURjLEdBckRIOztBQXlEYjtBQUNBLFlBQVU7QUFDUk8sVUFBTSxNQURFO0FBRVJDLGNBQVUsVUFGRjtBQUdSQyxZQUFRLFNBSEE7QUFJUkMsWUFBUTtBQUpBO0FBMURHLEMiLCJmaWxlIjoidmlld0NvbnRlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEZWZpbml0aW9uIG9mIHRoZSBjb250ZW50IHVzZWQgaW4gdGhlIHZpZXcgb2YgYEFjdGl2aXR5YCBpbnN0YW5jZXMuIFRoZSBrZXlcbi8vIG9mIHRoZSByZXR1cm5lZCBvYmplY3QgbWF0Y2ggdGhlIGlkIG9mIHRoZSBhY3Rpdml0aWVzLlxuLy9cbi8vIEVhY2ggY29udGVudCBkZWZpbmVzIHRoZSB2YXJpYWJsZXMgdGhhdCBhcmUgdXNlZCBpbnNpZGUgdGhlIGNvcnJlc3BvbmRpbmdcbi8vIFtgdGVtcGxhdGVgXXtAbGluayBtb2R1bGUgc291bmR3b3Jrcy9jbGllbnQuZGVmYXVsdFZpZXdUZW1wbGF0ZXN9LiBBIHNwZWNpYWxcbi8vIGtleSBgZ2xvYmFsc2AgaXMgYWNjZXNzaWJsZSBhbW9uZyBhbGwgdGVtcGxhdGVzIGFuZCBjYW4gdGhlbiBiZSB1c2VkIHRvIHNoYXJlXG4vLyB2YXJpYWJsZXMgYW1vbmcgYWxsIHRoZSB2aWV3cyBvZiB0aGUgYXBwbGljYXRpb24uXG4vLyBUaGVzZSBvYmplY3RzIGFyZSB1c2VkIHRvIHBvcHVsYXRlIHRoZSB0ZW1wbGF0ZXMgZGVjbGFyZWQgaW5zaWRlIHRoZVxuLy8gYH4vc3JjL2NsaWVudC9zaGFyZWQvdmlld1RlbXBsYXRlLmpzYCBmaWxlLlxuZXhwb3J0IGRlZmF1bHQge1xuICAvLyB2YXJpYWJsZXMgc2hhcmVkIGFtb25nIGFsbCB0ZW1wbGF0ZXMgdGhyb3VnaCB0aGUgZ2xvYmFsIG5hbWVzcGFjZVxuICAnZ2xvYmFscyc6IHt9LFxuXG4gIC8vIGNvbnRlbnQgb2YgdGhlIGBhdXRoYCBzZXJ2aWNlXG4gICdzZXJ2aWNlOmF1dGgnOiB7XG4gICAgaW5zdHJ1Y3Rpb25zOiAnTG9naW4nLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgICByZXNldDogJ1Jlc2V0JyxcbiAgICByZWplY3RNZXNzYWdlOiBgU29ycnksIHlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGlzIGNsaWVudGAsXG4gICAgcmVqZWN0ZWQ6IGZhbHNlLFxuICB9LFxuXG4gIC8vIGNvbnRlbnQgb2YgdGhlIGBjaGVja2luYCBzZXJ2aWNlXG4gICdzZXJ2aWNlOmNoZWNraW4nOiB7XG4gICAgbGFiZWxQcmVmaXg6ICdHbyB0bycsXG4gICAgbGFiZWxQb3N0Zml4OiAnVG91Y2ggdGhlIHNjcmVlbjxiciBjbGFzcz1cInBvcnRyYWl0LW9ubHlcIiAvPndoZW4geW91IGFyZSByZWFkeS4nLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgICBlcnJvck1lc3NhZ2U6ICdTb3JyeSw8YnIvPm5vIHBsYWNlIGF2YWlsYWJsZScsXG4gICAgd2FpdDogJ1BsZWFzZSB3YWl0Li4uJyxcbiAgICBsYWJlbDogJycsXG4gIH0sXG5cbiAgLy8gY29udGVudCBvZiB0aGUgYGxvYWRlcmAgc2VydmljZVxuICAnc2VydmljZTpsb2FkZXInOiB7XG4gICAgbG9hZGluZzogJ0xvYWRpbmcgc291bmRz4oCmJyxcbiAgfSxcblxuICAvLyBjb250ZW50IG9mIHRoZSBgbG9jYXRvcmAgc2VydmljZVxuICAnc2VydmljZTpsb2NhdG9yJzoge1xuICAgIGluc3RydWN0aW9uczogJ0RlZmluZSB5b3VyIHBvc2l0aW9uIGluIHRoZSBhcmVhJyxcbiAgICBzZW5kOiAnU2VuZCcsXG4gICAgc2hvd0J0bjogZmFsc2UsXG4gIH0sXG5cbiAgLy8gY29udGVudCBvZiB0aGUgYHBsYWNlcmAgc2VydmljZVxuICAnc2VydmljZTpwbGFjZXInOiB7XG4gICAgaW5zdHJ1Y3Rpb25zOiAnU2VsZWN0IHlvdXIgcG9zaXRpb24nLFxuICAgIHNlbmQ6ICdTZW5kJyxcbiAgICByZWplY3Q6ICdTb3JyeSwgbm8gcGxhY2UgaXMgYXZhaWxhYmxlJyxcbiAgICBzaG93QnRuOiBmYWxzZSxcbiAgICByZWplY3RlZDogZmFsc2UsXG4gIH0sXG5cbiAgLy8gY29udGVudCBvZiB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlXG4gICdzZXJ2aWNlOnBsYXRmb3JtJzoge1xuICAgIGlzQ29tcGF0aWJsZTogbnVsbCxcbiAgICBlcnJvck1lc3NhZ2U6ICdTb3JyeSw8YnIgLz5Zb3VyIGRldmljZSBpcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoaXMgYXBwbGljYXRpb24uJyxcbiAgICBpbnRybzogJ1dlbGNvbWUgdG8nLFxuICAgIGluc3RydWN0aW9uczogJ1RvdWNoIHRoZSBzY3JlZW4gdG8gam9pbiAhJyxcbiAgfSxcblxuICAvLyBjb250ZW50IG9mIHRoZSBgc3luY2Agc2VydmljZVxuICAnc2VydmljZTpzeW5jJzoge1xuICAgIHdhaXQ6IGBDbG9jayBzeW5jaW5nLDxiciAvPnN0YW5kIGJ5JmhlbGxpcDtgLFxuICB9LFxuXG4gIC8vIGNvbnRlbnQgb2YgdGhlIGBzdXJ2ZXlgIHNjZW5lXG4gICdzdXJ2ZXknOiB7XG4gICAgbmV4dDogJ05leHQnLFxuICAgIHZhbGlkYXRlOiAnVmFsaWRhdGUnLFxuICAgIHRoYW5rczogJ1RoYW5rcyEnLFxuICAgIGxlbmd0aDogJy0nLFxuICB9LFxufTtcbiJdfQ==