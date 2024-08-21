import $ from "jquery";
import { indexTasks, postTask, deleteTask } from "./requests.js";

//---- UPDATE TASK LIST ----
function updateTaskList() {
  indexTasks(function (response) {
    var htmlString = response.tasks
      .map(function (task) {
        return (
          "<div class='col-12 mb-3 p-2 border rounded task d-flex justify-content-between align-items-center' data-id='" +
          task.id +
          "'> " +
          task.content +
          // Add a button next to the task content
          "<button class='btn btn-danger btn-sm float-right delete-task' data-id='" +
          task.id +
          "'>X</button>" +
          "</div>"
        );
      })
      .join("");
    $("#tasks").html(htmlString);
  });
}

//---- POST NEW TASK ----

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

updateTaskList();

//---- DELETE TASK ----

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

//---- COMPLETE TASK ----

//---- UPDATE COMPLETED TASK LIST ----
