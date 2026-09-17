/* =====================================================
   SOCIAL & GREEN CLUB
   ATTENDANCE MANAGEMENT SYSTEM
   CLEAN + SAFE JAVASCRIPT
===================================================== */


/* =====================================================
   STORAGE KEYS
===================================================== */

const STUDENTS_KEY = "sgc_students";
const ATTENDANCE_KEY = "sgc_attendance";


/* =====================================================
   DATA
===================================================== */

let students = loadStudents();
let attendance = loadAttendance();

let selectedDate = getToday();


/* =====================================================
   LOAD DATA SAFELY
===================================================== */

function loadStudents() {
    try {
        const data = JSON.parse(
            localStorage.getItem(STUDENTS_KEY)
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.warn("Student data could not be loaded.");
        return [];
    }
}


function loadAttendance() {
    try {
        const data = JSON.parse(
            localStorage.getItem(ATTENDANCE_KEY)
        );

        return data && typeof data === "object" && !Array.isArray(data)
            ? data
            : {};

    } catch (error) {
        console.warn("Attendance data could not be loaded.");
        return {};
    }
}


/* =====================================================
   START WEBSITE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    updateCurrentDate();

    const attendanceDateInput =
        document.getElementById("attendanceDateInput");

    if (attendanceDateInput) {
        attendanceDateInput.value = selectedDate;
    }


    const studentForm =
        document.getElementById("studentForm");

    if (studentForm) {
        studentForm.addEventListener(
            "submit",
            saveStudent
        );
    }


    renderStudents();
    renderAttendance();
    updateDashboard();
    renderReports();

});


/* =====================================================
   DATE FUNCTIONS
===================================================== */

function getToday() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    if (isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function updateCurrentDate() {

    const element =
        document.getElementById("currentDate");

    if (element) {
        element.textContent =
            formatDate(getToday());
    }
}


/* =====================================================
   NAVIGATION
===================================================== */

function showSection(sectionId, button = null) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(function (section) {

        section.classList.remove(
            "active-section"
        );

    });


    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    const titles = {

        dashboard: "Dashboard",
        students: "Students",
        attendance: "Attendance",
        reports: "Reports"

    };


    const pageTitle =
        document.getElementById("pageTitle");

    if (pageTitle) {

        pageTitle.textContent =
            titles[sectionId] || "Dashboard";

    }


    document.querySelectorAll(
        ".nav-item"
    ).forEach(function (item) {

        item.classList.remove("active");

    });


    if (
        button &&
        button.classList.contains("nav-item")
    ) {

        button.classList.add("active");

    }


    if (sectionId === "attendance") {
        renderAttendance();
    }


    if (sectionId === "reports") {
        renderReports();
    }

}


/* =====================================================
   STORAGE
===================================================== */

function saveStudents() {

    localStorage.setItem(
        STUDENTS_KEY,
        JSON.stringify(students)
    );

}


function saveAttendance() {

    localStorage.setItem(
        ATTENDANCE_KEY,
        JSON.stringify(attendance)
    );

}


/* =====================================================
   ADD STUDENT MODAL
===================================================== */

function openStudentModal() {

    const editingInput =
        document.getElementById(
            "editingStudentId"
        );

    const editingId =
        editingInput
            ? editingInput.value
            : "";


    if (
        !editingId &&
        students.length >= 100
    ) {

        alert(
            "Maximum 100 students allowed."
        );

        return;
    }


    const modal =
        document.getElementById(
            "studentModal"
        );

    if (modal) {
        modal.classList.add("show");
    }

}


function closeStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );

    if (modal) {
        modal.classList.remove("show");
    }

}


/* =====================================================
   SAVE STUDENT
===================================================== */

function saveStudent(event) {

    event.preventDefault();


    const editingInput =
        document.getElementById(
            "editingStudentId"
        );

    const editingId =
        editingInput
            ? editingInput.value
            : "";


    const getValue = function (id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";

    };


    const name =
        getValue("studentName");

    const roll =
        getValue("rollNo");

    const mobile =
        getValue("mobileNo");

    const branch =
        getValue("branch");

    const section =
        getValue("section");

    const department =
        getValue("department");

    const course =
        getValue("course");

    const year =
        getValue("year");

    const joiningDate =
        getValue("joiningDate");


    /* REQUIRED FIELDS */

    if (!name) {
        alert("Please enter student name.");
        return;
    }

    if (!roll) {
        alert("Please enter roll number.");
        return;
    }


    /* MOBILE VALIDATION */

    if (
        mobile &&
        !/^[0-9]{10}$/.test(mobile)
    ) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    /* DUPLICATE ROLL CHECK */

    const duplicate =
        students.some(function (student) {

            return (
                String(student.roll || "")
                    .toLowerCase() ===
                roll.toLowerCase()
                &&
                String(student.id) !==
                String(editingId)
            );

        });


    if (duplicate) {

        alert(
            "This roll number already exists."
        );

        return;
    }


    /* STUDENT OBJECT */

    const studentData = {

        name: name,
        roll: roll,
        mobile: mobile,
        branch: branch,
        section: section,
        department: department,
        course: course,
        year: year,
        joiningDate: joiningDate

    };


    /* EDIT STUDENT */

    if (editingId) {

        const index =
            students.findIndex(
                function (student) {

                    return String(student.id) ===
                        String(editingId);

                }
            );


        if (index !== -1) {

            students[index] = {

                ...students[index],
                ...studentData

            };

        }

    }


    /* ADD STUDENT */

    else {

        if (students.length >= 100) {

            alert(
                "Maximum 100 students allowed."
            );

            return;
        }


        students.push({

            id:
                Date.now() +
                Math.floor(
                    Math.random() * 1000
                ),

            ...studentData

        });

    }


    saveStudents();

    resetStudentForm();

    closeStudentModal();

    renderStudents();

    renderAttendance();

    updateDashboard();

    renderReports();

}


/* =====================================================
   EDIT STUDENT
===================================================== */

function editStudent(id) {

    const student =
        students.find(function (item) {

            return String(item.id) ===
                String(id);

        });


    if (!student) {
        return;
    }


    const setValue = function (
        elementId,
        value
    ) {

        const element =
            document.getElementById(elementId);

        if (element) {
            element.value = value || "";
        }

    };


    setValue(
        "editingStudentId",
        student.id
    );

    setValue(
        "studentName",
        student.name
    );

    setValue(
        "rollNo",
        student.roll
    );

    setValue(
        "mobileNo",
        student.mobile
    );

    setValue(
        "branch",
        student.branch
    );

    setValue(
        "section",
        student.section
    );

    setValue(
        "department",
        student.department
    );

    setValue(
        "course",
        student.course
    );

    setValue(
        "year",
        student.year
    );

    setValue(
        "joiningDate",
        student.joiningDate
    );


    const title =
        document.getElementById(
            "studentModalTitle"
        );

    if (title) {
        title.textContent =
            "Edit Student";
    }


    const submitButton =
        document.getElementById(
            "studentSubmitBtn"
        );

    if (submitButton) {
        submitButton.textContent =
            "Save Changes";
    }


    const modal =
        document.getElementById(
            "studentModal"
        );

    if (modal) {
        modal.classList.add("show");
    }

}


/* =====================================================
   RESET STUDENT FORM
===================================================== */

function resetStudentForm() {

    const form =
        document.getElementById(
            "studentForm"
        );

    if (form) {
        form.reset();
    }


    const editingInput =
        document.getElementById(
            "editingStudentId"
        );

    if (editingInput) {
        editingInput.value = "";
    }


    const title =
        document.getElementById(
            "studentModalTitle"
        );

    if (title) {
        title.textContent =
            "Add Student";
    }


    const submitButton =
        document.getElementById(
            "studentSubmitBtn"
        );

    if (submitButton) {
        submitButton.textContent =
            "Add Student";
    }

}


/* =====================================================
   STUDENT LIST
===================================================== */

function renderStudents() {

    const list =
        document.getElementById(
            "studentList"
        );


    if (!list) {
        return;
    }


    const searchElement =
        document.getElementById(
            "searchInput"
        );

    const branchElement =
        document.getElementById(
            "branchFilter"
        );

    const yearElement =
        document.getElementById(
            "yearFilter"
        );


    const search =
        (
            searchElement
                ? searchElement.value
                : ""
        )
        .toLowerCase()
        .trim();


    const branch =
        branchElement
            ? branchElement.value
            : "";


    const year =
        yearElement
            ? yearElement.value
            : "";


    const filtered =
        students.filter(
            function (student) {

                const name =
                    String(
                        student.name || ""
                    ).toLowerCase();

                const roll =
                    String(
                        student.roll || ""
                    ).toLowerCase();


                const matchesSearch =
                    name.includes(search) ||
                    roll.includes(search);


                const matchesBranch =
                    !branch ||
                    student.branch === branch;


                const matchesYear =
                    !year ||
                    student.year === year;


                return (
                    matchesSearch &&
                    matchesBranch &&
                    matchesYear
                );

            }
        );


    const studentCount =
        document.getElementById(
            "studentCount"
        );

    if (studentCount) {

        studentCount.textContent =
            `${filtered.length} student${filtered.length !== 1 ? "s" : ""}`;

    }


    const limitCount =
        document.getElementById(
            "limitCount"
        );

    if (limitCount) {
        limitCount.textContent =
            students.length;
    }


    if (!filtered.length) {

        list.innerHTML = `

            <div class="empty-dashboard">

                <div class="empty-icon">
                    👤
                </div>

                <h3>
                    No students found
                </h3>

                <p>
                    Try changing your search
                    or filter.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML =
        filtered.map(
            function (student) {

                const stats =
                    getAttendanceStats(
                        student.id
                    );


                return `

                    <div class="student-card">

                        <div class="student-top">

                            <div class="avatar">

                                ${getInitials(
                                    student.name
                                )}

                            </div>

                            <div class="att-percent">

                                ${stats.percent}%

                            </div>

                        </div>


                        <h3>

                            ${escapeHTML(
                                student.name
                            )}

                        </h3>


                        <p class="student-meta">

                            ${escapeHTML(
                                student.branch || "-"
                            )}

                            ${
                                student.section
                                ? " • Section " +
                                  escapeHTML(
                                      student.section
                                  )
                                : ""
                            }

                            • Roll
                            ${escapeHTML(
                                student.roll || "-"
                            )}

                            <br>

                            ${escapeHTML(
                                student.course || "-"
                            )}

                            •

                            ${escapeHTML(
                                student.year || "-"
                            )}

                        </p>


                        <div class="card-actions">

                            <button
                                class="small-btn"
                                onclick="openProfile('${student.id}')"
                            >
                                Profile
                            </button>


                            <button
                                class="small-btn"
                                onclick="editStudent('${student.id}')"
                            >
                                Edit
                            </button>


                            <button
                                class="small-btn delete-btn"
                                onclick="removeStudent('${student.id}')"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   REMOVE STUDENT
===================================================== */

function removeStudent(id) {

    const student =
        students.find(function (item) {

            return String(item.id) ===
                String(id);

        });


    if (!student) {
        return;
    }


    const confirmed =
        confirm(
            `Remove ${student.name} from the club?`
        );


    if (!confirmed) {
        return;
    }


    students =
        students.filter(
            function (item) {

                return String(item.id) !==
                    String(id);

            }
        );


    /* REMOVE ATTENDANCE */

    Object.keys(attendance).forEach(
        function (date) {

            if (attendance[date]) {

                delete attendance[date][id];

            }

        }
    );


    saveStudents();

    saveAttendance();

    renderStudents();

    renderAttendance();

    updateDashboard();

    renderReports();

}


/* =====================================================
   ATTENDANCE DATE
===================================================== */

function changeAttendanceDate() {

    const input =
        document.getElementById(
            "attendanceDateInput"
        );


    if (!input) {
        return;
    }


    if (!input.value) {

        selectedDate =
            getToday();

        input.value =
            selectedDate;

    }

    else {

        selectedDate =
            input.value;

    }


    renderAttendance();

}


/* =====================================================
   MARK ONE STUDENT
===================================================== */

function markAttendance(
    studentId,
    status
) {

    if (
        status !== "present" &&
        status !== "absent"
    ) {
        return;
    }


    if (!selectedDate) {
        selectedDate = getToday();
    }


    if (!attendance[selectedDate]) {

        attendance[selectedDate] = {};

    }


    attendance[selectedDate][studentId] =
        status;


    saveAttendance();

    renderAttendance();

    updateDashboard();

    renderStudents();

    renderReports();

}


/* =====================================================
   MARK ALL
===================================================== */

function markAll(status) {

    if (
        status !== "present" &&
        status !== "absent"
    ) {
        return;
    }


    if (!students.length) {

        alert(
            "No students available."
        );

        return;
    }


    const statusText =
        status === "present"
            ? "PRESENT"
            : "ABSENT";


    const confirmed =
        confirm(
            `Mark all ${students.length} students as ${statusText} for ${formatDate(selectedDate)}?`
        );


    if (!confirmed) {
        return;
    }


    if (!attendance[selectedDate]) {

        attendance[selectedDate] = {};

    }


    students.forEach(
        function (student) {

            attendance[selectedDate][
                student.id
            ] = status;

        }
    );


    saveAttendance();

    renderAttendance();

    updateDashboard();

    renderStudents();

    renderReports();

}


/* =====================================================
   FILTER ATTENDANCE
===================================================== */

function getFilteredAttendanceStudents() {

    const getFilter =
        function (id) {

            const element =
                document.getElementById(id);

            return element
                ? element.value
                : "";

        };


    const search =
        getFilter("attendanceSearch")
            .toLowerCase()
            .trim();


    const branch =
        getFilter("attendanceBranch");


    const section =
        getFilter("attendanceSection");


    const department =
        getFilter("attendanceDepartment");


    const course =
        getFilter("attendanceCourse");


    const year =
        getFilter("attendanceYear");


    const statusFilter =
        getFilter("attendanceStatus");


    const dayData =
        attendance[selectedDate] || {};


    return students.filter(
        function (student) {

            const name =
                String(
                    student.name || ""
                ).toLowerCase();


            const roll =
                String(
                    student.roll || ""
                ).toLowerCase();


            const searchMatch =
                name.includes(search) ||
                roll.includes(search);


            const branchMatch =
                !branch ||
                student.branch === branch;


            const sectionMatch =
                !section ||
                student.section === section;


            const departmentMatch =
                !department ||
                student.department === department;


            const courseMatch =
                !course ||
                student.course === course;


            const yearMatch =
                !year ||
                student.year === year;


            const currentStatus =
                dayData[student.id] || "";


            let statusMatch = true;


            if (
                statusFilter === "present"
            ) {

                statusMatch =
                    currentStatus ===
                    "present";

            }


            if (
                statusFilter === "absent"
            ) {

                statusMatch =
                    currentStatus ===
                    "absent";

            }


            if (
                statusFilter === "not-marked"
            ) {

                statusMatch =
                    currentStatus === "";

            }


            return (
                searchMatch &&
                branchMatch &&
                sectionMatch &&
                departmentMatch &&
                courseMatch &&
                yearMatch &&
                statusMatch
            );

        }
    );

}


/* =====================================================
   RENDER ATTENDANCE
===================================================== */

function renderAttendance() {

    const list =
        document.getElementById(
            "attendanceList"
        );


    if (!list) {
        return;
    }


    const studentsToShow =
        getFilteredAttendanceStudents();


    const dayData =
        attendance[selectedDate] || {};


    let present = 0;
    let absent = 0;
    let pending = 0;


    studentsToShow.forEach(
        function (student) {

            const status =
                dayData[student.id];


            if (status === "present") {
                present++;
            }

            else if (status === "absent") {
                absent++;
            }

            else {
                pending++;
            }

        }
    );


    setText(
        "attendanceTotal",
        studentsToShow.length
    );

    setText(
        "attendancePresent",
        present
    );

    setText(
        "attendanceAbsent",
        absent
    );

    setText(
        "attendancePending",
        pending
    );


    if (!studentsToShow.length) {

        list.innerHTML = `

            <div class="empty-dashboard">

                <div class="empty-icon">
                    🔎
                </div>

                <h3>
                    No students found
                </h3>

                <p>
                    Change your filters
                    and try again.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML =
        studentsToShow.map(
            function (student) {

                const status =
                    dayData[student.id] || "";


                return `

                    <div class="attendance-row">

                        <div class="avatar">

                            ${getInitials(
                                student.name
                            )}

                        </div>


                        <div class="attendance-info">

                            <strong>

                                ${escapeHTML(
                                    student.name
                                )}

                            </strong>


                            <small>

                                ${escapeHTML(
                                    student.branch || "-"
                                )}

                                ${
                                    student.section
                                    ? " • Section " +
                                      escapeHTML(
                                          student.section
                                      )
                                    : ""
                                }

                                • Roll
                                ${escapeHTML(
                                    student.roll || "-"
                                )}

                            </small>

                        </div>


                        <div class="attendance-buttons">

                            <button
                                class="present-btn ${status === "present" ? "active" : ""}"
                                onclick="markAttendance('${student.id}','present')"
                            >
                                ✓ Present
                            </button>


                            <button
                                class="absent-btn ${status === "absent" ? "active" : ""}"
                                onclick="markAttendance('${student.id}','absent')"
                            >
                                × Absent
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   RESET ATTENDANCE FILTERS
===================================================== */

function resetAttendanceFilters() {

    const filterIds = [

        "attendanceSearch",
        "attendanceBranch",
        "attendanceSection",
        "attendanceDepartment",
        "attendanceCourse",
        "attendanceYear",
        "attendanceStatus"

    ];


    filterIds.forEach(
        function (id) {

            const element =
                document.getElementById(id);

            if (element) {
                element.value = "";
            }

        }
    );


    renderAttendance();

}


/* =====================================================
   ATTENDANCE STATISTICS
===================================================== */

function getAttendanceStats(studentId) {

    let present = 0;
    let absent = 0;


    Object.values(attendance).forEach(
        function (day) {

            if (!day) {
                return;
            }


            if (
                String(day[studentId]) ===
                "present"
            ) {

                present++;

            }


            if (
                String(day[studentId]) ===
                "absent"
            ) {

                absent++;

            }

        }
    );


    const total =
        present + absent;


    const percent =
        total > 0
            ? Math.round(
                (present / total) * 100
            )
            : 0;


    return {

        present: present,
        absent: absent,
        total: total,
        percent: percent

    };

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const today =
        getToday();


    const todayData =
        attendance[today] || {};


    let present = 0;
    let absent = 0;


    students.forEach(
        function (student) {

            if (
                todayData[student.id] ===
                "present"
            ) {

                present++;

            }


            if (
                todayData[student.id] ===
                "absent"
            ) {

                absent++;

            }

        }
    );


    const pending =
        Math.max(
            0,
            students.length -
            present -
            absent
        );


    setText(
        "totalStudents",
        students.length
    );

    setText(
        "presentToday",
        present
    );

    setText(
        "absentToday",
        absent
    );

    setText(
        "notMarked",
        pending
    );


    const box =
        document.getElementById(
            "dashboardStudents"
        );


    if (!box) {
        return;
    }


    if (!students.length) {

        box.innerHTML = `

            <div class="empty-icon">
                👥
            </div>

            <h3>
                No students added yet
            </h3>

            <p>
                Add your first student
                to start.
            </p>

            <button
                class="primary-btn"
                onclick="openStudentModal()"
            >
                + Add Student
            </button>

        `;

    }

    else {

        box.innerHTML = `

            <div class="empty-icon">
                ✓
            </div>

            <h3>
                Attendance is ready
            </h3>

            <p>

                ${present} Present •
                ${absent} Absent •
                ${pending} Not Marked

            </p>

            <button
                class="primary-btn"
                onclick="showSection('attendance')"
            >
                Open Attendance →
            </button>

        `;

    }

}


/* =====================================================
   PROFILE
===================================================== */

function openProfile(id) {

    const student =
        students.find(function (item) {

            return String(item.id) ===
                String(id);

        });


    if (!student) {
        return;
    }


    const stats =
        getAttendanceStats(
            student.id
        );


    let history = [];


    Object.keys(attendance).forEach(
        function (date) {

            const status =
                attendance[date]?.[student.id];


            if (status) {

                history.push({

                    date: date,
                    status: status

                });

            }

        }
    );


    history.sort(
        function (a, b) {

            return b.date.localeCompare(
                a.date
            );

        }
    );


    let historyHTML = "";


    if (!history.length) {

        historyHTML = `

            <div style="
                padding:20px;
                text-align:center;
                color:#718078;
                font-size:10px;
            ">

                No attendance recorded yet.

            </div>

        `;

    }

    else {

        historyHTML =
            history.map(
                function (item) {

                    const isPresent =
                        item.status ===
                        "present";


                    return `

                        <div class="history-row">

                            <span class="history-date">

                                ${formatDate(
                                    item.date
                                )}

                            </span>


                            <span class="
                                history-status
                                ${
                                    isPresent
                                    ? "history-present"
                                    : "history-absent"
                                }
                            ">

                                ${
                                    isPresent
                                    ? "✓ Present"
                                    : "× Absent"
                                }

                            </span>

                        </div>

                    `;

                }
            ).join("");

    }


    const profileContent =
        document.getElementById(
            "profileContent"
        );


    if (!profileContent) {
        return;
    }


    profileContent.innerHTML = `

        <div class="profile-header">

            <div class="profile-avatar">

                ${getInitials(
                    student.name
                )}

            </div>


            <div>

                <h2>

                    ${escapeHTML(
                        student.name
                    )}

                </h2>

                <p>

                    ${escapeHTML(
                        student.branch || "-"
                    )}

                    ${
                        student.section
                        ? " • Section " +
                          escapeHTML(
                              student.section
                          )
                        : ""
                    }

                </p>

            </div>

        </div>


        <div class="profile-stats">

            <div class="profile-stat">

                <strong>
                    ${stats.present}
                </strong>

                <span>
                    Present
                </span>

            </div>


            <div class="profile-stat">

                <strong>
                    ${stats.absent}
                </strong>

                <span>
                    Absent
                </span>

            </div>


            <div class="profile-stat">

                <strong>
                    ${stats.percent}%
                </strong>

                <span>
                    Attendance
                </span>

            </div>

        </div>


        <div class="profile-details">

            ${profileDetail(
                "ROLL NUMBER",
                student.roll
            )}

            ${profileDetail(
                "MOBILE",
                student.mobile ||
                "Not provided"
            )}

            ${profileDetail(
                "BRANCH",
                student.branch
            )}

            ${profileDetail(
                "SECTION",
                student.section ||
                "Not provided"
            )}

            ${profileDetail(
                "DEPARTMENT",
                student.department
            )}

            ${profileDetail(
                "COURSE",
                student.course
            )}

            ${profileDetail(
                "YEAR",
                student.year
            )}

            ${profileDetail(
                "DATE OF JOINING",
                formatDate(
                    student.joiningDate
                )
            )}

        </div>


        <h3 class="history-title">
            Attendance History
        </h3>


        <div class="history-list">

            ${historyHTML}

        </div>

    `;


    const modal =
        document.getElementById(
            "profileModal"
        );

    if (modal) {
        modal.classList.add("show");
    }

}


/* =====================================================
   PROFILE DETAIL
===================================================== */

function profileDetail(
    label,
    value
) {

    return `

        <div class="detail">

            <span>
                ${escapeHTML(label)}
            </span>

            <strong>

                ${escapeHTML(
                    String(
                        value ?? "-"
                    )
                )}

            </strong>

        </div>

    `;

}


/* =====================================================
   CLOSE PROFILE
===================================================== */

function closeProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );

    if (modal) {
        modal.classList.remove("show");
    }

}


/* =====================================================
   REPORTS
===================================================== */

function renderReports() {

    const totalElement =
        document.getElementById(
            "reportTotal"
        );

    const presentElement =
        document.getElementById(
            "reportPresent"
        );

    const absentElement =
        document.getElementById(
            "reportAbsent"
        );


    if (
        !totalElement ||
        !presentElement ||
        !absentElement
    ) {
        return;
    }


    let totalPresent = 0;
    let totalAbsent = 0;


    students.forEach(
        function (student) {

            const stats =
                getAttendanceStats(
                    student.id
                );


            totalPresent +=
                stats.present;


            totalAbsent +=
                stats.absent;

        }
    );


    totalElement.textContent =
        students.length;


    presentElement.textContent =
        totalPresent;


    absentElement.textContent =
        totalAbsent;


    const list =
        document.getElementById(
            "reportList"
        );


    if (!list) {
        return;
    }


    if (!students.length) {

        list.innerHTML = `

            <div class="empty-dashboard">

                <h3>
                    No report data
                </h3>

                <p>
                    Add students first.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML =
        students.map(
            function (student) {

                const stats =
                    getAttendanceStats(
                        student.id
                    );


                return `

                    <div class="report-row">

                        <div>

                            <strong>

                                ${escapeHTML(
                                    student.name
                                )}

                            </strong>

                            <small>

                                ${escapeHTML(
                                    student.branch || "-"
                                )}

                                • Roll

                                ${escapeHTML(
                                    student.roll || "-"
                                )}

                            </small>

                        </div>


                        <strong>

                            ${stats.present} P /
                            ${stats.absent} A

                        </strong>


                        <strong>

                            ${stats.percent}%

                        </strong>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   DOWNLOAD ATTENDANCE CSV
===================================================== */

function downloadAttendance() {

    if (!students.length) {

        alert(
            "No students available."
        );

        return;
    }


    const date =
        selectedDate || getToday();


    const dayData =
        attendance[date] || {};


    let csv =
        "Name,Roll Number,Branch,Section,Department,Course,Year,Mobile,Status,Date\n";


    students.forEach(
        function (student) {

            const status =
                dayData[student.id] ||
                "Not Marked";


            csv +=

                csvValue(student.name) + "," +

                csvValue(student.roll) + "," +

                csvValue(student.branch) + "," +

                csvValue(student.section) + "," +

                csvValue(student.department) + "," +

                csvValue(student.course) + "," +

                csvValue(student.year) + "," +

                csvValue(student.mobile) + "," +

                csvValue(
                    status === "present"
                        ? "Present"
                        : status === "absent"
                            ? "Absent"
                            : "Not Marked"
                ) + "," +

                csvValue(date) +

                "\n";

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        "Social_Green_Club_Attendance_" +
        date +
        ".csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


/* =====================================================
   CSV VALUE
===================================================== */

function csvValue(value) {

    return `"${String(value ?? "")
        .replace(/"/g, '""')}"`;

}


/* =====================================================
   INITIALS
===================================================== */

function getInitials(name) {

    const cleanName =
        String(name || "")
            .trim();


    if (!cleanName) {
        return "?";
    }


    return cleanName
        .split(/\s+/)
        .slice(0, 2)
        .map(
            function (word) {

                return word
                    .charAt(0)
                    .toUpperCase();

            }
        )
        .join("");

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const element =
        document.createElement("div");


    element.textContent =
        String(text ?? "");


    return element.innerHTML;

}


/* =====================================================
   SET TEXT SAFELY
===================================================== */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {
        element.textContent = value;
    }

}


/* =====================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList &&
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {

            event.target.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   ESC KEY CLOSES MODALS
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        document
            .querySelectorAll(
                ".modal-overlay.show"
            )
            .forEach(
                function (modal) {

                    modal.classList.remove(
                        "show"
                    );

                }
            );

    }
);