function calculateAge() {
    let dob = document.getElementById("dob").value;
    let result = document.getElementById("result");

    if (dob === "") {
        result.innerHTML = "Please select your Date of Birth!";
        return;
    }

    let birthDate = new Date(dob);
    let today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // Total days lived
    let diffTime = today - birthDate;
    let totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Next birthday
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    let daysLeft = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    result.innerHTML = `
        You are <br>
        ${years} Years ${months} Months ${days} Days old <br><br>
        Total Days Lived: ${totalDays} days <br>
        Days until next Birthday: ${daysLeft} days 🎂
    `;
}
