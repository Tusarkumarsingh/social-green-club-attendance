/* =====================================================
   SOCIAL & GREEN CLUB
   ATTENDANCE MANAGEMENT SYSTEM
   SUPABASE VERSION
===================================================== */


/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "https://fsbjmbsaelziokfxuceu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2R1qWvsM0ZV58svpkX1O-g_vDFBu9oq";


/* Make sure Supabase library exists */
if (!window.supabase) {
    alert(
        "Supabase library is not loaded. Check your index.html."
    );
}


/* Create Supabase client */
const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   DATA
===================================================== */

let students = [];

let attendance = {};

let selectedDate = getToday();


/* =====================================================
   START WEBSITE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        updateCurrentDate();


        /* Attendance date */
        const attendanceDateInput =
            document.getElementById(
                "attendanceDateInput"
            );


        if (attendanceDateInput) {

            attendanceDateInput.value =
                selectedDate;

        }


        /* Student form */
        const studentForm =
            document.getElementById(
                "studentForm"
            );


        if (studentForm) {

            studentForm.addEventListener(
                "submit",
                saveStudent
            );

        }


        /* Load database */
        await loadAllData();


        /* Render everything */
        renderStudents();

        renderAttendance();

        updateDashboard();

        renderReports();

    }
);


/* =====================================================
   LOAD ALL DATA FROM SUPABASE
===================================================== */

async function loadAllData() {

    try {

        /* ---------------------------------------------
           LOAD STUDENTS
        --------------------------------------------- */

        const {
            data: studentRows,
            error: studentError
        } =
            await supabaseClient
                .from("students")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: true
                    }
                );


        if (studentError) {

            console.error(
                "Students load error:",
                studentError
            );

            alert(
                "Could not load students.\n\n" +
                studentError.message
            );

            students = [];

        } else {

            students =
                (studentRows || [])
                    .map(
                        mapStudentFromDB
                    );

        }


        /* ---------------------------------------------
           LOAD ATTENDANCE
        --------------------------------------------- */

        const {
            data: attendanceRows,
            error: attendanceError
        } =
            await supabaseClient
                .from("attendance")
                .select("*")
                .order(
                    "attendance_date",
                    {
                        ascending: true
                    }
                );


        if (attendanceError) {

            console.error(
                "Attendance load error:",
                attendanceError
            );

            alert(
                "Could not load attendance.\n\n" +
                attendanceError.message
            );

            attendance = {};

        } else {

            attendance =
                mapAttendanceFromDB(
                    attendanceRows || []
                );

        }

    } catch (error) {

        console.error(
            "Supabase connection error:",
            error
        );

        alert(
            "Supabase connection failed.\n\n" +
            (
                error.message ||
                "Unknown error"
            )
        );

        students = [];

        attendance = {};

    }

}


/* =====================================================
   DATABASE MAPPING
===================================================== */

function mapStudentFromDB(row) {

    return {

        id:
            row.id,

        name:
            row.name || "",

        roll:
            row.roll_no || "",

        mobile:
            row.mobile_no || "",

        branch:
            row.branch || "",

        section:
            row.section || "",

        department:
            row.department || "",

        /*
           Your current database appears to use
           "coure" as the column name.

           This also supports "course" if you
           later rename the database column.
        */
        course:
            row.coure ||
            row.course ||
            "",

        year:
            row.year || "",

        joiningDate:
            row.joining_date || ""

    };

}


/* =====================================================
   ATTENDANCE DATABASE MAPPING
===================================================== */

function mapAttendanceFromDB(rows) {

    const result = {};


    rows.forEach(
        function (row) {

            const date =
                row.attendance_date;


            if (!date) {
                return;
            }


            if (!result[date]) {

                result[date] = {};

            }


            result[date][
                String(row.student_id)
            ] =
                row.status || "";

        }
    );


    return result;

}


/* =====================================================
   DATE FUNCTIONS
===================================================== */

function getToday() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

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


/* =====================================================
   CURRENT DATE
===================================================== */

function updateCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    if (element) {

        element.textContent =
            formatDate(
                getToday()
            );

    }

}


/* =====================================================
   NAVIGATION
===================================================== */

function showSection(
    sectionId,
    button = null
) {

    /* Hide all sections */

    document
        .querySelectorAll(
            ".section"
        )
        .forEach(
            function (section) {

                section.classList.remove(
                    "active-section"
                );

            }
        );


    /* Show selected section */

    const selectedSection =
        document.getElementById(
            sectionId
        );


    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    /* Page titles */

    const titles = {

        dashboard:
            "Dashboard",

        students:
            "Students",

        attendance:
            "Attendance",

        reports:
            "Reports"

    };


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    if (pageTitle) {

        pageTitle.textContent =
            titles[sectionId] ||
            "Dashboard";

    }


    /* Navigation active */

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );


    if (
        button &&
        button.classList.contains(
            "nav-item"
        )
    ) {

        button.classList.add(
            "active"
        );

    }


    if (
        sectionId ===
        "attendance"
    ) {

        renderAttendance();

    }


    if (
        sectionId ===
        "reports"
    ) {

        renderReports();

    }

}


/* =====================================================
   STUDENT MODAL
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

        modal.classList.add(
            "show"
        );

    }

}


/* =====================================================
   CLOSE STUDENT MODAL
===================================================== */

function closeStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   SAVE STUDENT
===================================================== */

async function saveStudent(event) {

    event.preventDefault();


    const editingInput =
        document.getElementById(
            "editingStudentId"
        );


    const editingId =
        editingInput
            ? editingInput.value
            : "";


    /* Helper to get form values */

    function getValue(id) {

        const element =
            document.getElementById(id);


        return element
            ? element.value.trim()
            : "";

    }


    const name =
        getValue(
            "studentName"
        );


    const roll =
        getValue(
            "rollNo"
        );


    const mobile =
        getValue(
            "mobileNo"
        );


    const branch =
        getValue(
            "branch"
        );


    const section =
        getValue(
            "section"
        );


    const department =
        getValue(
            "department"
        );


    const course =
        getValue(
            "course"
        );


    const year =
        getValue(
            "year"
        );


    const joiningDate =
        getValue(
            "joiningDate"
        );


    /* Validation */

    if (!name) {

        alert(
            "Please enter student name."
        );

        return;

    }


    if (!roll) {

        alert(
            "Please enter roll number."
        );

        return;

    }


    if (
        mobile &&
        !/^[0-9]{10}$/.test(
            mobile
        )
    ) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;

    }


    /* Duplicate roll number */

    const duplicate =
        students.some(
            function (student) {

                return (

                    String(
                        student.roll || ""
                    ).toLowerCase()
                    ===
                    roll.toLowerCase()

                    &&

                    String(
                        student.id
                    )
                    !==
                    String(
                        editingId
                    )

                );

            }
        );


    if (duplicate) {

        alert(
            "This roll number already exists."
        );

        return;

    }


    /* Database object */

    const dbStudent = {

        name:
            name,

        roll_no:
            roll,

        mobile_no:
            mobile || null,

        branch:
            branch || null,

        section:
            section || null,

        department:
            department || null,

        /*
           IMPORTANT:
           Your current Supabase database uses
           "coure".
        */
        coure:
            course || null,

        year:
            year || null,

        joining_date:
            joiningDate || null

    };


    const submitButton =
        document.getElementById(
            "studentSubmitBtn"
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            editingId
                ? "Saving..."
                : "Adding...";

    }


    try {

        /* ---------------------------------------------
           EDIT STUDENT
        --------------------------------------------- */

        if (editingId) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("students")
                    .update(
                        dbStudent
                    )
                    .eq(
                        "id",
                        editingId
                    )
                    .select()
                    .single();


            if (error) {

                throw error;

            }


            const index =
                students.findIndex(
                    function (student) {

                        return (
                            String(
                                student.id
                            )
                            ===
                            String(
                                editingId
                            )
                        );

                    }
                );


            if (index !== -1) {

                students[index] =
                    mapStudentFromDB(
                        data
                    );

            }

        }

        /* ---------------------------------------------
           ADD STUDENT
        --------------------------------------------- */

        else {

            if (
                students.length >= 100
            ) {

                alert(
                    "Maximum 100 students allowed."
                );

                return;

            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .from("students")
                    .insert(
                        [dbStudent]
                    )
                    .select()
                    .single();


            if (error) {

                throw error;

            }


            students.push(
                mapStudentFromDB(
                    data
                )
            );

        }


        /* Refresh */

        resetStudentForm();

        closeStudentModal();

        renderStudents();

        renderAttendance();

        updateDashboard();

        renderReports();


        alert(
            editingId
                ? "Student updated successfully."
                : "Student added successfully."
        );


    } catch (error) {

        console.error(
            "Student save error:",
            error
        );


        alert(
            "Could not save student.\n\n" +
            (
                error.message ||
                "Unknown error"
            )
        );


    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                editingId
                    ? "Save Changes"
                    : "Add Student";

        }

    }

}


/* =====================================================
   EDIT STUDENT
===================================================== */

function editStudent(id) {

    const student =
        students.find(
            function (item) {

                return (
                    String(
                        item.id
                    )
                    ===
                    String(id)
                );

            }
        );


    if (!student) {

        return;

    }


    function setValue(
        elementId,
        value
    ) {

        const element =
            document.getElementById(
                elementId
            );


        if (element) {

            element.value =
                value || "";

        }

    }


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

        modal.classList.add(
            "show"
        );

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

        editingInput.value =
            "";

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
   RENDER STUDENTS
===================================================== */

function renderStudents() {

    const list =
        document.getElementById(
            "studentList"
        );


    if (!list) {

        return;

    }


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const branchFilter =
        document.getElementById(
            "branchFilter"
        );


    const yearFilter =
        document.getElementById(
            "yearFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const branch =
        branchFilter
            ? branchFilter.value
            : "";


    const year =
        yearFilter
            ? yearFilter.value
            : "";


    const filtered =
        students.filter(
            function (student) {

                const searchable = [

                    student.name,

                    student.roll,

                    student.mobile,

                    student.branch,

                    student.section,

                    student.department,

                    student.course,

                    student.year

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const matchesBranch =
                    !branch ||
                    String(
                        student.branch || ""
                    )
                    ===
                    String(branch);


                const matchesYear =
                    !year ||
                    String(
                        student.year || ""
                    )
                    ===
                    String(year);


                return (
                    matchesSearch &&
                    matchesBranch &&
                    matchesYear
                );

            }
        );


    /* Count */

    setText(
        "studentCount",
        filtered.length
    );


    setText(
        "limitCount",
        `${students.length}/100`
    );


    /* Empty */

    if (!filtered.length) {

        list.innerHTML = `

            <div class="empty-dashboard">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    ${
                        students.length
                            ? "No students found"
                            : "No students added yet"
                    }
                </h3>

                <p>
                    ${
                        students.length
                            ? "Try changing your search or filters."
                            : "Add your first student to start."
                    }
                </p>

            </div>

        `;

        return;

    }


    /* Student cards */

    list.innerHTML =
        filtered.map(
            function (student) {

                const stats =
                    getAttendanceStats(
                        student.id
                    );


                const todayStatus =
                    (
                        attendance[
                            getToday()
                        ] || {}
                    )[
                        String(
                            student.id
                        )
                    ] || "";


                let statusText =
                    "Not Marked";


                let statusClass =
                    "status-pending";


                if (
                    todayStatus ===
                    "present"
                ) {

                    statusText =
                        "Present";

                    statusClass =
                        "status-present";

                }


                if (
                    todayStatus ===
                    "absent"
                ) {

                    statusText =
                        "Absent";

                    statusClass =
                        "status-absent";

                }


                return `

                    <div class="student-card">

                        <div class="student-card-top">

                            <div class="avatar">

                                ${getInitials(
                                    student.name
                                )}

                            </div>


                            <div class="student-main-info">

                                <h3>

                                    ${escapeHTML(
                                        student.name
                                    )}

                                </h3>


                                <p>

                                    Roll:
                                    ${escapeHTML(
                                        student.roll || "-"
                                    )}

                                </p>

                            </div>


                            <span class="${statusClass}">

                                ${statusText}

                            </span>

                        </div>


                        <div class="student-details">

                            <div>

                                <strong>
                                    Branch
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        student.branch || "-"
                                    )}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Section
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        student.section || "-"
                                    )}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Department
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        student.department || "-"
                                    )}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Course
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        student.course || "-"
                                    )}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Year
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        student.year || "-"
                                    )}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Mobile
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        student.mobile || "-"
                                    )}
                                </span>

                            </div>

                        </div>


                        <div class="attendance-summary">

                            <div>

                                <strong>
                                    ${stats.present}
                                </strong>

                                <span>
                                    Present
                                </span>

                            </div>


                            <div>

                                <strong>
                                    ${stats.absent}
                                </strong>

                                <span>
                                    Absent
                                </span>

                            </div>


                            <div>

                                <strong>
                                    ${stats.percent}%
                                </strong>

                                <span>
                                    Attendance
                                </span>

                            </div>

                        </div>


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

async function removeStudent(id) {

    const student =
        students.find(
            function (item) {

                return (
                    String(
                        item.id
                    )
                    ===
                    String(id)
                );

            }
        );


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


    try {

        /* Delete attendance first */

        const {
            error:
                attendanceDeleteError
        } =
            await supabaseClient
                .from("attendance")
                .delete()
                .eq(
                    "student_id",
                    id
                );


        if (
            attendanceDeleteError
        ) {

            throw attendanceDeleteError;

        }


        /* Delete student */

        const {
            error:
                studentDeleteError
        } =
            await supabaseClient
                .from("students")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (
            studentDeleteError
        ) {

            throw studentDeleteError;

        }


        /* Update local data */

        students =
            students.filter(
                function (item) {

                    return (
                        String(
                            item.id
                        )
                        !==
                        String(id)
                    );

                }
            );


        Object.keys(
            attendance
        ).forEach(
            function (date) {

                if (
                    attendance[date]
                ) {

                    delete attendance[
                        date
                    ][
                        String(id)
                    ];

                }

            }
        );


        renderStudents();

        renderAttendance();

        updateDashboard();

        renderReports();

        closeProfile();


        alert(
            "Student removed successfully."
        );


    } catch (error) {

        console.error(
            "Remove student error:",
            error
        );


        alert(
            "Could not remove student.\n\n" +
            (
                error.message ||
                "Unknown error"
            )
        );

    }

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

    } else {

        selectedDate =
            input.value;

    }


    renderAttendance();

}


/* =====================================================
   GET FILTERED ATTENDANCE STUDENTS
===================================================== */

function getFilteredAttendanceStudents() {

    const searchElement =
        document.getElementById(
            "attendanceSearch"
        );


    const branchElement =
        document.getElementById(
            "attendanceBranch"
        );


    const sectionElement =
        document.getElementById(
            "attendanceSection"
        );


    const departmentElement =
        document.getElementById(
            "attendanceDepartment"
        );


    const courseElement =
        document.getElementById(
            "attendanceCourse"
        );


    const yearElement =
        document.getElementById(
            "attendanceYear"
        );


    const statusElement =
        document.getElementById(
            "attendanceStatus"
        );


    const search =
        searchElement
            ? searchElement.value
                .trim()
                .toLowerCase()
            : "";


    const branch =
        branchElement
            ? branchElement.value
            : "";


    const section =
        sectionElement
            ? sectionElement.value
            : "";


    const department =
        departmentElement
            ? departmentElement.value
            : "";


    const course =
        courseElement
            ? courseElement.value
            : "";


    const year =
        yearElement
            ? yearElement.value
            : "";


    const status =
        statusElement
            ? statusElement.value
            : "";


    const dayData =
        attendance[
            selectedDate
        ] || {};


    return students.filter(
        function (student) {

            const searchable = [

                student.name,

                student.roll,

                student.mobile,

                student.branch,

                student.section,

                student.department,

                student.course,

                student.year

            ]
                .join(" ")
                .toLowerCase();


            const currentStatus =
                dayData[
                    String(
                        student.id
                    )
                ] || "";


            const matchesSearch =
                !search ||
                searchable.includes(
                    search
                );


            const matchesBranch =
                !branch ||
                String(
                    student.branch || ""
                )
                ===
                String(branch);


            const matchesSection =
                !section ||
                String(
                    student.section || ""
                )
                ===
                String(section);


            const matchesDepartment =
                !department ||
                String(
                    student.department || ""
                )
                ===
                String(department);


            const matchesCourse =
                !course ||
                String(
                    student.course || ""
                )
                ===
                String(course);


            const matchesYear =
                !year ||
                String(
                    student.year || ""
                )
                ===
                String(year);


            let matchesStatus =
                true;


            if (status) {

                if (
                    status ===
                    "pending"
                ) {

                    matchesStatus =
                        !currentStatus;

                } else {

                    matchesStatus =
                        currentStatus ===
                        status;

                }

            }


            return (

                matchesSearch &&

                matchesBranch &&

                matchesSection &&

                matchesDepartment &&

                matchesCourse &&

                matchesYear &&

                matchesStatus

            );

        }
    );

}


/* =====================================================
   MARK ONE STUDENT ATTENDANCE
===================================================== */

async function markAttendance(
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

        selectedDate =
            getToday();

    }


    try {

        /* Find existing attendance */

        const {
            data: existingRows,
            error: findError
        } =
            await supabaseClient
                .from("attendance")
                .select("id")
                .eq(
                    "student_id",
                    Number(studentId)
                )
                .eq(
                    "attendance_date",
                    selectedDate
                )
                .order(
                    "id",
                    {
                        ascending: true
                    }
                )
                .limit(1);


        if (findError) {

            throw findError;

        }


        /* ---------------------------------------------
           UPDATE EXISTING
        --------------------------------------------- */

        if (
            existingRows &&
            existingRows.length > 0
        ) {

            const {
                error
            } =
                await supabaseClient
                    .from("attendance")
                    .update({
                        status:
                            status
                    })
                    .eq(
                        "id",
                        existingRows[0].id
                    );


            if (error) {

                throw error;

            }

        }

        /* ---------------------------------------------
           INSERT NEW
        --------------------------------------------- */

        else {

            const {
                error
            } =
                await supabaseClient
                    .from("attendance")
                    .insert([
                        {
                            student_id:
                                Number(studentId),

                            attendance_date:
                                selectedDate,

                            status:
                                status
                        }
                    ]);


            if (error) {

                throw error;

            }

        }


        /* Update local data */

        if (
            !attendance[
                selectedDate
            ]
        ) {

            attendance[
                selectedDate
            ] = {};

        }


        attendance[
            selectedDate
        ][
            String(studentId)
        ] =
            status;


        /* Refresh */

        renderAttendance();

        updateDashboard();

        renderStudents();

        renderReports();


        console.log(
            `Attendance saved: Student ${studentId} → ${status}`
        );


    } catch (error) {

        console.error(
            "Attendance save error:",
            error
        );


        alert(
            "Could not save attendance.\n\n" +
            (
                error.message ||
                "Unknown error"
            )
        );

    }

}


/* =====================================================
   MARK ALL STUDENTS
===================================================== */

async function markAll(status) {

    if (
        status !== "present" &&
        status !== "absent"
    ) {

        return;

    }


    if (!selectedDate) {

        selectedDate =
            getToday();

    }


    if (!students.length) {

        alert(
            "No students available."
        );

        return;

    }


    const confirmed =
        confirm(
            `Mark ALL ${students.length} students as ${status}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        /* ---------------------------------------------
           GET EXISTING ROWS FOR THIS DATE
        --------------------------------------------- */

        const {
            data: existingRows,
            error: existingError
        } =
            await supabaseClient
                .from("attendance")
                .select(
                    "id, student_id"
                )
                .eq(
                    "attendance_date",
                    selectedDate
                );


        if (existingError) {

            throw existingError;

        }


        const existingMap = {};


        (
            existingRows || []
        ).forEach(
            function (row) {

                const key =
                    String(
                        row.student_id
                    );


                /*
                   Keep the first row if duplicate
                   records somehow exist.
                */
                if (
                    !existingMap[key]
                ) {

                    existingMap[key] =
                        row.id;

                }

            }
        );


        const rowsToInsert = [];

        const rowsToUpdate = [];


        /* ---------------------------------------------
           PREPARE DATABASE CHANGES
        --------------------------------------------- */

        students.forEach(
            function (student) {

                const key =
                    String(
                        student.id
                    );


                if (
                    existingMap[key]
                ) {

                    rowsToUpdate.push({

                        id:
                            existingMap[key],

                        status:
                            status

                    });

                } else {

                    rowsToInsert.push({

                        student_id:
                            Number(
                                student.id
                            ),

                        attendance_date:
                            selectedDate,

                        status:
                            status

                    });

                }

            }
        );


        /* ---------------------------------------------
           UPDATE EXISTING ROWS
        --------------------------------------------- */

        for (
            const row
            of rowsToUpdate
        ) {

            const {
                error
            } =
                await supabaseClient
                    .from("attendance")
                    .update({
                        status:
                            row.status
                    })
                    .eq(
                        "id",
                        row.id
                    );


            if (error) {

                throw error;

            }

        }


        /* ---------------------------------------------
           INSERT NEW ROWS
        --------------------------------------------- */

        if (
            rowsToInsert.length
        ) {

            const {
                error
            } =
                await supabaseClient
                    .from("attendance")
                    .insert(
                        rowsToInsert
                    );


            if (error) {

                throw error;

            }

        }


        /* ---------------------------------------------
           UPDATE LOCAL DATA
        --------------------------------------------- */

        if (
            !attendance[
                selectedDate
            ]
        ) {

            attendance[
                selectedDate
            ] = {};

        }


        students.forEach(
            function (student) {

                attendance[
                    selectedDate
                ][
                    String(
                        student.id
                    )
                ] =
                    status;

            }
        );


        /* Refresh */

        renderAttendance();

        updateDashboard();

        renderStudents();

        renderReports();


        alert(
            `All students marked ${status}.`
        );


    } catch (error) {

        console.error(
            "Mark all error:",
            error
        );


        alert(
            "Could not mark all attendance.\n\n" +
            (
                error.message ||
                "Unknown error"
            )
        );

    }

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
        attendance[
            selectedDate
        ] || {};


    let present = 0;

    let absent = 0;

    let pending = 0;


    /* Count */

    studentsToShow.forEach(
        function (student) {

            const status =
                dayData[
                    String(
                        student.id
                    )
                ];


            if (
                status ===
                "present"
            ) {

                present++;

            }

            else if (
                status ===
                "absent"
            ) {

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


    /* Empty */

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
                    Change your filters and try again.
                </p>

            </div>

        `;

        return;

    }


    /* Attendance rows */

    list.innerHTML =
        studentsToShow.map(
            function (student) {

                const status =
                    dayData[
                        String(
                            student.id
                        )
                    ] || "";


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
                                class="present-btn ${
                                    status === "present"
                                        ? "active"
                                        : ""
                                }"
                                onclick="markAttendance(
                                    '${student.id}',
                                    'present'
                                )"
                            >
                                ✓ Present
                            </button>


                            <button
                                class="absent-btn ${
                                    status === "absent"
                                        ? "active"
                                        : ""
                                }"
                                onclick="markAttendance(
                                    '${student.id}',
                                    'absent'
                                )"
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

    [

        "attendanceSearch",

        "attendanceBranch",

        "attendanceSection",

        "attendanceDepartment",

        "attendanceCourse",

        "attendanceYear",

        "attendanceStatus"

    ].forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    "";

            }

        }
    );


    renderAttendance();

}


/* =====================================================
   ATTENDANCE STATISTICS
===================================================== */

function getAttendanceStats(
    studentId
) {

    let present = 0;

    let absent = 0;


    Object.values(
        attendance
    ).forEach(
        function (day) {

            if (!day) {

                return;

            }


            const status =
                day[
                    String(
                        studentId
                    )
                ];


            if (
                status ===
                "present"
            ) {

                present++;

            }


            if (
                status ===
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
                (
                    present /
                    total
                ) * 100
            )
            : 0;


    return {

        present:
            present,

        absent:
            absent,

        total:
            total,

        percent:
            percent

    };

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const today =
        getToday();


    const todayData =
        attendance[
            today
        ] || {};


    let present = 0;

    let absent = 0;


    students.forEach(
        function (student) {

            const status =
                todayData[
                    String(
                        student.id
                    )
                ];


            if (
                status ===
                "present"
            ) {

                present++;

            }


            if (
                status ===
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
                Add your first student to start.
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

                ${present}
                Present •

                ${absent}
                Absent •

                ${pending}
                Not Marked

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
        students.find(
            function (item) {

                return (
                    String(
                        item.id
                    )
                    ===
                    String(id)
                );

            }
        );


    if (!student) {

        return;

    }


    const stats =
        getAttendanceStats(
            student.id
        );


    let history = [];


    Object.keys(
        attendance
    ).forEach(
        function (date) {

            const status =
                attendance[
                    date
                ]?.[
                    String(
                        student.id
                    )
                ];


            if (status) {

                history.push({

                    date:
                        date,

                    status:
                        status

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

            <div
                style="
                    padding:20px;
                    text-align:center;
                    color:#718078;
                    font-size:14px;
                "
            >
                No attendance recorded yet.
            </div>

        `;

    }

    else {

        historyHTML =
            history.map(
                function (item) {

                    const label =
                        item.status ===
                        "present"
                            ? "Present"
                            : "Absent";


                    const className =
                        item.status ===
                        "present"
                            ? "status-present"
                            : "status-absent";


                    return `

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                padding:12px 0;
                                border-bottom:1px solid var(--border);
                            "
                        >

                            <span>

                                ${formatDate(
                                    item.date
                                )}

                            </span>


                            <span class="${className}">

                                ${label}

                            </span>

                        </div>

                    `;

                }
            ).join("");

    }


    const content =
        document.getElementById(
            "profileContent"
        );


    if (!content) {

        return;

    }


    content.innerHTML = `

        <div class="profile-header">

            <div class="avatar profile-avatar">

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

                    Roll:
                    ${escapeHTML(
                        student.roll || "-"
                    )}

                </p>

            </div>

        </div>


        <div class="profile-stats">

            <div>

                <strong>
                    ${stats.present}
                </strong>

                <span>
                    Present
                </span>

            </div>


            <div>

                <strong>
                    ${stats.absent}
                </strong>

                <span>
                    Absent
                </span>

            </div>


            <div>

                <strong>
                    ${stats.percent}%
                </strong>

                <span>
                    Attendance
                </span>

            </div>

        </div>


        <div class="profile-details">

            <div>

                <strong>
                    Mobile
                </strong>

                <span>
                    ${escapeHTML(
                        student.mobile || "-"
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Branch
                </strong>

                <span>
                    ${escapeHTML(
                        student.branch || "-"
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Section
                </strong>

                <span>
                    ${escapeHTML(
                        student.section || "-"
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Department
                </strong>

                <span>
                    ${escapeHTML(
                        student.department || "-"
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Course
                </strong>

                <span>
                    ${escapeHTML(
                        student.course || "-"
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Year
                </strong>

                <span>
                    ${escapeHTML(
                        student.year || "-"
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Joining Date
                </strong>

                <span>
                    ${formatDate(
                        student.joiningDate
                    )}
                </span>

            </div>

        </div>


        <div class="profile-history">

            <h3>
                Attendance History
            </h3>

            ${historyHTML}

        </div>

    `;


    const modal =
        document.getElementById(
            "profileModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

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

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   REPORTS
===================================================== */

function renderReports() {

    const total =
        students.length;


    let totalPresent = 0;

    let totalAbsent = 0;


    Object.values(
        attendance
    ).forEach(
        function (day) {

            if (!day) {

                return;

            }


            Object.values(
                day
            ).forEach(
                function (status) {

                    if (
                        status ===
                        "present"
                    ) {

                        totalPresent++;

                    }


                    if (
                        status ===
                        "absent"
                    ) {

                        totalAbsent++;

                    }

                }
            );

        }
    );


    setText(
        "reportTotal",
        total
    );


    setText(
        "reportPresent",
        totalPresent
    );


    setText(
        "reportAbsent",
        totalAbsent
    );


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

                <div class="empty-icon">
                    📊
                </div>

                <h3>
                    No report data yet
                </h3>

                <p>
                    Add students and mark attendance.
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

                                Roll:
                                ${escapeHTML(
                                    student.roll || "-"
                                )}

                            </small>

                        </div>


                        <div>

                            <span>

                                Present:
                                ${stats.present}

                            </span>


                            <span>

                                Absent:
                                ${stats.absent}

                            </span>


                            <strong>

                                ${stats.percent}%

                            </strong>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   DOWNLOAD ATTENDANCE CSV
===================================================== */

function downloadAttendance() {

    const dateInput =
        document.getElementById(
            "attendanceDateInput"
        );


    const date =
        dateInput &&
        dateInput.value
            ? dateInput.value
            : selectedDate;


    if (!students.length) {

        alert(
            "No students available."
        );

        return;

    }


    const dayData =
        attendance[
            date
        ] || {};


    const rows = [];


    rows.push([

        "Name",

        "Roll No",

        "Mobile No",

        "Branch",

        "Section",

        "Department",

        "Course",

        "Year",

        "Joining Date",

        "Attendance Date",

        "Status"

    ]);


    students.forEach(
        function (student) {

            const status =
                dayData[
                    String(
                        student.id
                    )
                ] || "";


            rows.push([

                student.name,

                student.roll,

                student.mobile,

                student.branch,

                student.section,

                student.department,

                student.course,

                student.year,

                student.joiningDate,

                date,

                status === "present"
                    ? "Present"
                    :
                    status === "absent"
                        ? "Absent"
                        : "Not Marked"

            ]);

        }
    );


    const csv =
        rows
            .map(
                function (row) {

                    return row
                        .map(
                            csvValue
                        )
                        .join(",");

                }
            )
            .join("\n");


    const blob =
        new Blob(
            [
                "\ufeff" +
                csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `attendance-${date}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =====================================================
   CSV VALUE
===================================================== */

function csvValue(value) {

    const stringValue =
        String(
            value ?? ""
        );


    if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
    ) {

        return (
            '"' +
            stringValue.replace(
                /"/g,
                '""'
            ) +
            '"'
        );

    }


    return stringValue;

}


/* =====================================================
   HELPERS
===================================================== */

function getInitials(name) {

    const clean =
        String(
            name || ""
        ).trim();


    if (!clean) {

        return "?";

    }


    const parts =
        clean
            .split(/\s+/)
            .filter(Boolean);


    if (
        parts.length === 1
    ) {

        return parts[0]
            .substring(
                0,
                2
            )
            .toUpperCase();

    }


    return (

        parts[0][0] +

        parts[
            parts.length - 1
        ][0]

    ).toUpperCase();

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   SET TEXT
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   INPUT EVENTS
===================================================== */

document.addEventListener(
    "input",
    function (event) {

        if (
            event.target &&
            event.target.id ===
            "searchInput"
        ) {

            renderStudents();

        }


        if (
            event.target &&
            event.target.id ===
            "attendanceSearch"
        ) {

            renderAttendance();

        }

    }
);


/* =====================================================
   CHANGE EVENTS
===================================================== */

document.addEventListener(
    "change",
    function (event) {

        const id =
            event.target
                ? event.target.id
                : "";


        /* Student filters */

        if (
            id === "branchFilter" ||
            id === "yearFilter"
        ) {

            renderStudents();

        }


        /* Attendance filters */

        if (

            id ===
            "attendanceBranch" ||

            id ===
            "attendanceSection" ||

            id ===
            "attendanceDepartment" ||

            id ===
            "attendanceCourse" ||

            id ===
            "attendanceYear" ||

            id ===
            "attendanceStatus"

        ) {

            renderAttendance();

        }


        /* Attendance date */

        if (
            id ===
            "attendanceDateInput"
        ) {

            changeAttendanceDate();

        }

    }
);


/* =====================================================
   CLOSE MODALS BY CLICKING OUTSIDE
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
   ESC KEY CLOSE MODALS
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

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


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {
                console.log("Service Worker registered successfully");
            })
            .catch(error => {
                console.error("Service Worker registration failed:", error);
            });
    });
}