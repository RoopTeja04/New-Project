import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoClose, IoChevronDown } from "react-icons/io5";
import useProjectStore from "../../../stores/ProjectStores";
import useColumnStore from "../../../stores/ColumnStores";
import useTaskStore from "../../../stores/TaskStores";
import useAuthStore from "../../../stores/authStores";

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-green-500/10 text-green-400",
  MEDIUM: "bg-yellow-500/10 text-yellow-400",
  HIGH: "bg-red-500/10 text-red-400",
};

const TasksViewProject = () => {
  const navigate = useNavigate();
  const { projectID } = useLocation().state as { projectID: string };

  const { projectDetails, getProjectDetails } = useProjectStore();
  const { columns, setColumns, createColumn, reorderColumns, deleteColumn } =
    useColumnStore();
  const {
    tasksByColumn,
    getTasksByColumn,
    createTask,
    moveTask,
    deleteTask,
    reorderTasksInColumn,
    creating: creatingTask,
  } = useTaskStore();
  const { userId } = useAuthStore();

  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);

  const [activeColumnForTask, setActiveColumnForTask] = useState<
    string | null
  >(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigneedID: "",
  });
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  useEffect(() => {
    if (projectID) getProjectDetails(projectID);
  }, [projectID]);

  useEffect(() => {
    if (projectDetails?.columns) {
      const sorted = [...projectDetails.columns].sort(
        (a: any, b: any) => a.position - b.position,
      );
      setColumns(sorted);
    }
  }, [projectDetails]);

  const columnIds = columns.map((c: any) => c._id).join(",");

  useEffect(() => {
    columns.forEach((column: any) => {
      getTasksByColumn(column._id);
    });
  }, [columnIds]);

  const project = projectDetails?.project;
  const members = projectDetails?.members || [];

  const selectedAssignee = members.find(
    (m: any) => m.userID?._id === taskForm.assigneedID,
  );

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;

    try {
      await createColumn(projectID, newColumnTitle.trim());
      setNewColumnTitle("");
      setShowAddColumn(false);
      await getProjectDetails(projectID);
      toast.success("Column added successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add column");
    }
  };

  const handleDeleteColumn = async (id: string) => {
    try {
      await deleteColumn(id);
      setOpenColumnMenu(null);
      toast.success("Column deleted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete column");
    }
  };

  const openAddTask = (columnID: string) => {
    setActiveColumnForTask(columnID);
    setTaskForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      assigneedID: "",
    });
  };

  const handleCreateTask = async () => {
    if (!activeColumnForTask) return;

    if (!taskForm.title.trim() || !taskForm.assigneedID) {
      toast.error("Task title and assignee are required.");
      return;
    }

    try {
      await createTask({
        projectID,
        columnID: activeColumnForTask,
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        assigneedID: taskForm.assigneedID,
        createdUser: userId,
      });
      toast.success("Task created successfully");
      setActiveColumnForTask(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create task");
    }
  };

  const handleDeleteTask = async (taskID: string, columnID: string) => {
    try {
      await deleteTask(taskID, columnID);
      toast.success("Task deleted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete task");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "COLUMN") {
      const reordered = [...columns];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      const withPositions = reordered.map((column, index) => ({
        ...column,
        position: index + 1,
      }));

      try {
        await reorderColumns(withPositions);
      } catch (err: any) {
        toast.error(err?.message || "Failed to reorder columns");
      }
      return;
    }

    const sourceColumnID = source.droppableId;
    const destColumnID = destination.droppableId;

    if (sourceColumnID === destColumnID) {
      const tasks = [...(tasksByColumn[sourceColumnID] || [])];
      const [moved] = tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, moved);
      reorderTasksInColumn(sourceColumnID, tasks);
      return;
    }

    try {
      await moveTask(draggableId, sourceColumnID, destColumnID);
    } catch (err: any) {
      toast.error(err?.message || "Failed to move task");
    }
  };

  if (!project) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-6 py-6 text-gray-400">
        Loading board...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 min-h-screen flex flex-col space-y-6 px-6 py-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-600 px-2 py-1 hover:bg-gray-800 transition"
          >
            <MdKeyboardArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-semibold tracking-wide">
            {project.name} — Board
          </h1>
        </div>

        <button
          onClick={() => setShowAddColumn(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium tracking-wide transition hover:bg-green-700"
        >
          <FaPlus size={12} /> Add Column
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="board"
          direction="horizontal"
          type="COLUMN"
        >
          {(boardProvided) => (
            <div
              ref={boardProvided.innerRef}
              {...boardProvided.droppableProps}
              className="flex min-w-0 items-start gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {columns.map((column: any, index: number) => {
                const tasks = tasksByColumn[column._id] || [];

                return (
                  <Draggable
                    key={column._id}
                    draggableId={column._id}
                    index={index}
                  >
                    {(columnProvided) => (
                      <div
                        ref={columnProvided.innerRef}
                        {...columnProvided.draggableProps}
                        className="flex w-72 shrink-0 flex-col rounded-xl border border-gray-700 bg-[#071225]"
                      >
                        <div
                          {...columnProvided.dragHandleProps}
                          className="flex cursor-grab items-center justify-between border-b border-gray-800 px-4 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm font-semibold text-white">
                              {column.title}
                            </h2>
                            <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                              {tasks.length}
                            </span>
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenColumnMenu((prev) =>
                                  prev === column._id ? null : column._id,
                                )
                              }
                              className="cursor-pointer rounded-md p-1 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                            >
                              <HiDotsVertical size={16} />
                            </button>

                            {openColumnMenu === column._id && (
                              <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-gray-700 bg-black shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteColumn(column._id)}
                                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                                >
                                  <FaTrash size={12} /> Delete Column
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <Droppable droppableId={column._id} type="TASK">
                          {(taskProvided, taskSnapshot) => (
                            <div
                              ref={taskProvided.innerRef}
                              {...taskProvided.droppableProps}
                              className={`flex min-h-24 flex-1 flex-col gap-2 p-3 transition-colors ${
                                taskSnapshot.isDraggingOver
                                  ? "bg-blue-500/5"
                                  : ""
                              }`}
                            >
                              {tasks.map((task: any, taskIndex: number) => (
                                <Draggable
                                  key={task._id}
                                  draggableId={task._id}
                                  index={taskIndex}
                                >
                                  {(taskDragProvided, taskDragSnapshot) => (
                                    <div
                                      ref={taskDragProvided.innerRef}
                                      {...taskDragProvided.draggableProps}
                                      {...taskDragProvided.dragHandleProps}
                                      className={`group flex cursor-grab flex-col gap-2 rounded-lg border border-gray-800 bg-[#08162B] p-3 transition ${
                                        taskDragSnapshot.isDragging
                                          ? "border-blue-500 shadow-lg"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium text-white">
                                          {task.title}
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteTask(
                                              task._id,
                                              column._id,
                                            )
                                          }
                                          className="cursor-pointer text-gray-600 opacity-0 transition group-hover:opacity-100 hover:text-red-500"
                                        >
                                          <FaTrash size={11} />
                                        </button>
                                      </div>

                                      {task.description && (
                                        <p className="line-clamp-2 text-xs text-gray-400">
                                          {task.description}
                                        </p>
                                      )}

                                      <div className="flex items-center justify-between pt-1">
                                        <span
                                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                            PRIORITY_STYLES[task.priority] ||
                                            "bg-gray-500/10 text-gray-400"
                                          }`}
                                        >
                                          {task.priority}
                                        </span>

                                        <div className="flex items-center gap-1.5">
                                          {task.assigneedID?.avatar ? (
                                            <img
                                              src={task.assigneedID.avatar}
                                              alt={task.assigneedID.name}
                                              className="h-5 w-5 rounded-full object-cover"
                                            />
                                          ) : (
                                            <FaRegCircleUser className="h-5 w-5 text-gray-500" />
                                          )}
                                          <span className="text-[11px] text-gray-400">
                                            {task.assigneedID?.name}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {taskProvided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        <button
                          type="button"
                          onClick={() => openAddTask(column._id)}
                          className="flex cursor-pointer items-center gap-2 border-t border-gray-800 px-4 py-3 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
                        >
                          <FaPlus size={11} /> Add Task
                        </button>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {boardProvided.placeholder}

              {showAddColumn && (
                <div className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border border-gray-700 bg-[#071225] p-4">
                  <input
                    autoFocus
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                    placeholder="Column title"
                    className="w-full rounded-lg border border-gray-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddColumn}
                      className="flex-1 cursor-pointer rounded-lg bg-green-600 py-2 text-sm font-medium transition hover:bg-green-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddColumn(false);
                        setNewColumnTitle("");
                      }}
                      className="flex-1 cursor-pointer rounded-lg border border-gray-600 py-2 text-sm transition hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {activeColumnForTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#08111F] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
              <h2 className="text-xl font-semibold text-white">
                Add Task
              </h2>
              <button
                onClick={() => setActiveColumnForTask(null)}
                className="cursor-pointer rounded-full p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
              >
                <IoClose size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  placeholder="Task title"
                  className="w-full rounded-lg border border-gray-600 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  placeholder="Task description"
                  className="w-full resize-none rounded-lg border border-gray-600 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                    Priority
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPriorityDropdown((p) => !p)}
                    onBlur={() =>
                      setTimeout(() => setShowPriorityDropdown(false), 150)
                    }
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-600 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <span>{taskForm.priority}</span>
                    <IoChevronDown
                      className={`transition-transform ${
                        showPriorityDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showPriorityDropdown && (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-600 bg-black shadow-lg">
                      {PRIORITY_OPTIONS.map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onMouseDown={() => {
                            setTaskForm({ ...taskForm, priority });
                            setShowPriorityDropdown(false);
                          }}
                          className="w-full cursor-pointer border-b border-gray-700 px-4 py-2.5 text-left text-sm transition-colors last:border-none hover:bg-gray-800"
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative flex-1">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                    Assignee
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAssigneeDropdown((p) => !p)}
                    onBlur={() =>
                      setTimeout(() => setShowAssigneeDropdown(false), 150)
                    }
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-600 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                      selectedAssignee ? "text-white" : "text-gray-500"
                    }`}
                  >
                    <span className="truncate">
                      {selectedAssignee?.userID?.name || "Select member"}
                    </span>
                    <IoChevronDown
                      className={`shrink-0 transition-transform ${
                        showAssigneeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showAssigneeDropdown && (
                    <div className="absolute z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-600 bg-black shadow-lg">
                      {members.map((member: any) => (
                        <button
                          key={member._id}
                          type="button"
                          onMouseDown={() => {
                            setTaskForm({
                              ...taskForm,
                              assigneedID: member.userID._id,
                            });
                            setShowAssigneeDropdown(false);
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 border-b border-gray-700 px-4 py-2.5 text-left text-sm transition-colors last:border-none hover:bg-gray-800"
                        >
                          {member.userID?.avatar ? (
                            <img
                              src={member.userID.avatar}
                              alt={member.userID.name}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <FaRegCircleUser className="h-6 w-6 text-gray-500" />
                          )}
                          {member.userID?.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setActiveColumnForTask(null)}
                className="w-full cursor-pointer rounded-md bg-gray-200 px-4 py-3 text-black shadow-md transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={creatingTask}
                className="w-full cursor-pointer rounded-md bg-green-600 px-4 py-3 text-white shadow-md transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingTask ? "Creating Task..." : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksViewProject;
