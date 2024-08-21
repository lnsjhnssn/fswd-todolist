import $ from "jquery";

$.ajaxSetup({
  headers: {
    "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
  },
});

export var indexTasks = function (successCB, errorCB) {
  var request = {
    type: "GET",
    url: "api/tasks?api_key=1",
    success: successCB,
    error: errorCB,
  };

  $.ajax(request);
};

export var postTask = function (content) {
  return new Promise((resolve, reject) => {
    var request = {
      type: "POST",
      url: "api/tasks?api_key=1",
      data: {
        task: {
          content: content,
        },
      },
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    };
    $.ajax(request);
  });
};

export var deleteTask = function (id) {
  return new Promise((resolve, reject) => {
    var request = {
      type: "DELETE",
      url: "api/tasks/" + id + "?api_key=1",
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    };
    $.ajax(request);
  });
};

// postTask("task from requests.js");
// working
