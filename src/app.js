import { CourseManager } from "./courseManager.js";

const courseManager = new CourseManager([
  {
    name: "Software Engineering",
    code: "CS 401",
    documents: 24,
    notes: 12,
    progress: 80,
    color: "#4d0b83",
    lightColor: "#ead8ff",
  },
  {
    name: "Database Systems",
    code: "CS 320",
    documents: 15,
    notes: 8,
    progress: 60,
    color: "#0874bd",
    lightColor: "#d9eaff",
  },
  {
    name: "Web Programming",
    code: "CS 250",
    documents: 5,
    notes: 2,
    progress: 20,
    color: "#099b70",
    lightColor: "#d5f5e9",
  },
]);

const courseGrid = document.getElementById("courseGrid");

const addCourseButton = document.getElementById("addCourseButton");
const uploadModal = document.getElementById("uploadModal");
const metadataModal = document.getElementById("metadataModal");

const closeModal = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");

const browseButton = document.getElementById("browseButton");
const fileInput = document.getElementById("fileInput");
const selectedFile = document.getElementById("selectedFile");

const uploadButton = document.getElementById("uploadButton");

const courseSelect = document.getElementById("courseSelect");
const chapterSelect = document.getElementById("chapterSelect");

const uploadedFileName = document.getElementById("uploadedFileName");
const metadataCourse = document.getElementById("metadataCourse");
const metadataChapter = document.getElementById("metadataChapter");

const confirmMetadata = document.getElementById("confirmMetadata");

let selectedUpload = null;

function renderCourses() {
  courseGrid.innerHTML = "";

  courseManager.getCourses().forEach((course) => {
    const card = document.createElement("article");

    card.className = "course-card";

    card.style.setProperty("--course-color", course.color);
    card.style.setProperty("--course-light", course.lightColor);
    card.style.setProperty("--progress", `${course.progress}%`);

    card.innerHTML = `
      <div class="course-content">
        <div class="course-icon">▣</div>

        <button class="course-menu">⋮</button>

        <h2>${course.name}</h2>

        <div class="course-code">
          ${course.code} • Prof. Davis
        </div>

        <div class="course-stats">
          <span>▧ ${course.documents} docs</span>
          <span>☷ ${course.notes} notes</span>
        </div>

        <div class="progress-header">
          <span>Chapter 8 of 10</span>
          <span>${course.progress}%</span>
        </div>

        <div class="progress">
          <div class="progress-value"></div>
        </div>

        <button class="continue-button">
          Continue Learning →
        </button>
      </div>
    `;

    courseGrid.appendChild(card);
  });
}

function populateCourseSelect() {
  courseSelect.innerHTML = "";

  courseManager.getCourses().forEach((course) => {
    const option = document.createElement("option");

    option.value = course.code;
    option.textContent = course.name;

    courseSelect.appendChild(option);
  });
}

function openUploadModal() {
  populateCourseSelect();

  selectedUpload = null;
  selectedFile.textContent = "";

  uploadModal.classList.remove("hidden");
}

function closeUploadModal() {
  uploadModal.classList.add("hidden");
}

addCourseButton.addEventListener("click", openUploadModal);

closeModal.addEventListener("click", closeUploadModal);

cancelButton.addEventListener("click", closeUploadModal);

browseButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  selectedUpload = file;
  selectedFile.textContent = `Selected: ${file.name}`;
});

uploadButton.addEventListener("click", () => {
  if (!selectedUpload) {
    alert("Please choose a file first.");
    return;
  }

  const selectedCourse = courseManager
    .getCourses()
    .find((course) => course.code === courseSelect.value);

  if (!selectedCourse) {
    alert("Please select a course.");
    return;
  }

  if (chapterSelect.value === "Choose a chapter...") {
    alert("Please select a chapter.");
    return;
  }

  uploadedFileName.textContent = selectedUpload.name;
  metadataCourse.textContent = selectedCourse.name;
  metadataChapter.textContent = chapterSelect.value;

  closeUploadModal();

  metadataModal.classList.remove("hidden");
});

confirmMetadata.addEventListener("click", () => {
  const courseCode = courseSelect.value;

  courseManager.addDocument(courseCode);

  metadataModal.classList.add("hidden");

  renderCourses();
});

renderCourses();