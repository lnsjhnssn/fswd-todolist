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
    return tasks;
  }
}

// Update button styles depending on filter
function updateFilterButtons() {
  $("#btn-show-all").removeClass("btn-dark").addClass("btn-outline-secondary");
  $("#btn-show-active")
    .removeClass("btn-dark")
    .addClass("btn-outline-secondary");
  $("#btn-show-completed")
    .removeClass("btn-dark")
    .addClass("btn-outline-secondary");

  if (currentFilter === "all") {
    $("#btn-show-all")
      .removeClass("btn-outline-secondary")
      .addClass("btn-dark");
  } else if (currentFilter === "active") {
    $("#btn-show-active")
      .removeClass("btn-outline-secondary")
      .addClass("btn-dark");
  } else if (currentFilter === "completed") {
    $("#btn-show-completed")
      .removeClass("btn-outline-secondary")
      .addClass("btn-dark");
  }
}

// Update the task list based on the current filter
function updateTaskList() {
  getAllTasks(function (response) {
    const filteredTasks = filterTasks(response.tasks, currentFilter);
    const htmlString = filteredTasks
      .map(function (task) {
        const taskClass = task.completed ? "text-decoration-line-through" : "";
        return (
          "<div class='col-12 my-2 d-flex justify-content-between align-items-center " +
          taskClass +
          "' data-id='" +
          task.id +
          "'>" +
          task.content +
          "<div><button class='btn btn-outline btn-sm complete-task' data-id='" +
          task.id +
          "'>[done]</button>" +
          "<button class='ms-4 btn btn-outline btn-sm float-right delete-task' data-id='" +
          task.id +
          "'>[delete]</button></div>" +
          "</div>"
        );
      })
      .join("");
    $("#tasks").html(htmlString);
    updateFilterButtons();
    console.log(response.tasks);
  });
}

// Event listeners for filter buttons
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
