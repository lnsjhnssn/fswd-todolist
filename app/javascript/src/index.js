import $ from "jquery";

import {
  getAllTasks,
  getTaskById,
  postTask,
  deleteTask,
  markTaskComplete,
  markTaskActive,
} from "./requests.js";

// ---- Filter and show tasklist

let currentFilter = "all";

function filterTasks(tasks, filter) {
  if (filter === "active") {
    return tasks.filter((task) => !task.completed);
  } else if (filter === "completed") {
    return tasks.filter((task) => task.completed);
  } else {
    return tasks; // Return all tasks
  }
}

// Update the task list based on the current filter
function updateTaskList() {
  getAllTasks(function (response) {
    const filteredTasks = filterTasks(response.tasks, currentFilter);
    // Render the filtered tasks (this part remains similar to updateTaskList)
    const htmlString = filteredTasks
      .map(function (task) {
        return (
          "<div class='col-12 mb-3 p-2 border rounded task d-flex justify-content-between align-items-center' data-id='" +
          task.id +
          "'> " +
          task.content +
          "<button class='btn btn-danger btn-sm float-right complete-task' data-id='" +
          task.id +
          "'>V</button>" +
          "<button class='btn btn-danger btn-sm float-right delete-task' data-id='" +
          task.id +
          "'>X</button>" +
          "</div>"
        );
      })
      .join("");
    $("#tasks").html(htmlString);
    console.log(response.tasks);
  });
}

// Eventlisteners for filter buttons
$(document).on("click", "#btn-show-all", function () {
  currentFilter = "all";
  updateTaskList();
});

$(document).on("click", "#btn-show-active", function () {
  currentFilter = "active";
  updateTaskList();
});

$(document).on("click", "#btn-show-completed", function () {
  currentFilter = "completed";
  updateTaskList();
});

//---- Post new task

$(document).on("keypress", async (event) => {
  if (event.key === "Enter") {
    const taskContent = $("#task-input").val().trim();

    if (taskContent) {
      try {
        await postTask(taskContent);
        updateTaskList();
        $("#task-input").val("");
      } catch (error) {
        console.error("Error posting task:", error);
      }
    }
  }
});

//---- Delete task

$(document).on("click", ".delete-task", function () {
  var id = $(this).data("id");
  deleteTask(id)
    .then(() => {
      updateTaskList();
    })
    .catch((error) => {
      console.error("Failed to delete task:", error);
    });
});

//---- Mark task as complete or active

$(document).on("click", ".complete-task", function () {
  var id = $(this).data("id");

  getTaskById(id)
    .then((task) => {
      if (task.completed) {
        markTaskActive(id)
          .then(() => {
            updateTaskList();
          })
          .catch((error) => {
            console.error("Failed to mark task as active:", error);
          });
      } else {
        markTaskComplete(id)
          .then(() => {
            updateTaskList();
          })
          .catch((error) => {
            console.error("Failed to mark task as complete:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Failed to fetch task data:", error);
    });
});

//---- Update tasklist on load
updateTaskList();
