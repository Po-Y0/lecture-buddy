// ============================
// Lecture Buddy - Course Management
// ============================

// DOM Elements
const addCourseBtn = document.getElementById("addCourseBtn");
const modal = document.getElementById("courseModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

const courseName = document.getElementById("courseName");
const courseCode = document.getElementById("courseCode");

const courseList = document.getElementById("courseList");
const emptyState = document.getElementById("emptyState");
const modalTitle = document.getElementById("modalTitle");

// Data
let courses = [];
let editIndex = null;

// --------------------------
// Open Modal
// --------------------------

function openModal() {
    modal.classList.remove("hidden");
}

// --------------------------
// Close Modal
// --------------------------

function closeModalBox() {

    modal.classList.add("hidden");

    courseName.value = "";
    courseCode.value = "";

    editIndex = null;

    modalTitle.textContent = "Add Course";
}

// --------------------------
// Render Course Cards
// --------------------------

function renderCourses() {

    courseList.innerHTML = "";

    if (courses.length === 0) {

        emptyState.style.display = "block";

        return;
    }

    emptyState.style.display = "none";

    courses.forEach((course, index) => {

        const card = document.createElement("article");

        card.className = "course-card";

        card.innerHTML = `
            <div class="course-icon">📘</div>

            <h3>${course.name}</h3>

            <p class="course-code">${course.code}</p>

            <div class="card-buttons">

                <button
                    class="edit-btn"
                    onclick="editCourse(${index})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCourse(${index})">
                    Delete
                </button>

            </div>
        `;

        courseList.appendChild(card);

    });

}

// --------------------------
// Save Course
// --------------------------

saveBtn.addEventListener("click", () => {

    const name = courseName.value.trim();
    const code = courseCode.value.trim();

    if (name === "" || code === "") {

        alert("Please fill in all fields.");

        return;
    }

    if (editIndex === null) {

        courses.push({
            name,
            code
        });

    } else {

        courses[editIndex] = {
            name,
            code
        };

    }

    renderCourses();

    closeModalBox();

});

// --------------------------
// Edit
// --------------------------

function editCourse(index) {

    editIndex = index;

    modalTitle.textContent = "Edit Course";

    courseName.value = courses[index].name;
    courseCode.value = courses[index].code;

    openModal();

}

// --------------------------
// Delete
// --------------------------

function deleteCourse(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    courses.splice(index, 1);

    renderCourses();

}

// --------------------------
// Events
// --------------------------

addCourseBtn.addEventListener("click", openModal);

closeModal.addEventListener("click", closeModalBox);

cancelBtn.addEventListener("click", closeModalBox);

// --------------------------
// Initial Render
// --------------------------

renderCourses();