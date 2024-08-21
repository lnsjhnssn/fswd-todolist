import $ from "jquery";

$.ajaxSetup({
  headers: {
    "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
  },
});

// Get all tasks
export var getAllTasks = function (successCB, errorCB) {
  var request = {
    type: "GET",
    url: "api/tasks?api_key=1",
    success: successCB,
    error: errorCB,
  };

  $.ajax(request);
};

// Get task by id
export var getTaskById = function (id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: `api/tasks/${id}?api_key=1`,
      success: function (response) {
        resolve(response.task); // Resolve the task data
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

// Post new task
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
      url: `api/tasks/${id}?api_key=1`,
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

// Mark task as complete
export var markTaskComplete = function (id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "PUT",
      url: `api/tasks/${id}/mark_complete?api_key=1`,
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

// Mark task as active
export var markTaskActive = function (id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "PUT",
      url: `api/tasks/${id}/mark_active?api_key=1`,
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};
