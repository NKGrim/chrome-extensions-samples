let allGradeDetails = [];
let allGrades = [];
let allClassGPA = [];
console.log("Content script is running!");

(function() {
    // Function to handle the 'coursesContainer' div and get its children with the class 'row'
    function handleRowElements() {
        const coursesContainer = document.getElementById("coursesContainer");

        if (coursesContainer) {
            console.log("Div found:", coursesContainer);

            // Get all children with the class 'row'
            const rowChildren = coursesContainer.getElementsByClassName("row");
            if (rowChildren.length >= 11) {
                Array.from(rowChildren).forEach((child, index) => {
                    console.log(`Child ${index + 1}:`, child);

                    let colMd2 = child.getElementsByClassName('col-md-2 standard-padding-needed');
                    if(colMd2.length == 1)
                    {
                      let gradeDetail = colMd2[0].getElementsByClassName('showGrade');
                      allGradeDetails.push(gradeDetail);

                     checkForAllRows();
                    }
                    // Perform desired operations on each 'row' child here
                });

                // Stop observing for row elements after they're found
                rowObserver.disconnect();
            } else {
                console.log("No 'row' elements found yet, observing...");
            }
        } else {
            console.log("Div with ID 'coursesContainer' not found yet, observing...");
        }
    }

    // Create a MutationObserver for monitoring the container's children
    const rowObserver = new MutationObserver(function(mutationsList, observer) {
        handleRowElements();
    });

    // Create a MutationObserver to watch for the addition of 'coursesContainer'
    const containerObserver = new MutationObserver(function(mutationsList, observer) {
        const coursesContainer = document.getElementById("coursesContainer");
        if (coursesContainer) {
            console.log("CoursesContainer detected!");
            handleRowElements();

            // Start observing the container for child node additions
            rowObserver.observe(coursesContainer, { childList: true, subtree: true });

            // Stop observing for the container as it's already found
            observer.disconnect();
        }
    });

    // Start observing the body for the addition of 'coursesContainer'
    containerObserver.observe(document.body, { childList: true, subtree: true });

    // Initial check in case 'coursesContainer' is already present
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            handleRowElements();
        });
    } else {
        handleRowElements();
    }
})();

function checkForAllRows()
{
  if(allGradeDetails.length > 6)
  {
    const observer = new MutationObserver(function(mutationsList, observer) {
            mutationsList.forEach(mutation => {
                // Check for text content in elements with the specific class
                checkTextContent(allGradeDetails);
            });
        });

        // Start observing the body for subtree changes
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        checkTextContent(allGradeDetails);
    };


    console.log(allGradeDetails.length)
  }
let textBoxCreated = false;
function checkTextContent(elements) {

console.log(allGradeDetails);

        Array.from(elements).forEach((element, index) => {
            if (element[0].textContent != null) {
                console.log(`Element ${index + 1} with textContent found:`, element[0].textContent);
                if(allGrades.length < allGradeDetails.length)
                {
                  allGrades.splice(index, 1, element[0].textContent);
                  console.log(allGrades.length);
                  console.log(allGrades);
                }


                if(allGrades.length == allGradeDetails.length)
                {
                  allGrades.forEach((grade, i) => {
                    let floatGrade = parseFloat(grade);


                    if(floatGrade < 59.5) allClassGPA.push(0);
                    if(floatGrade >= 59.5 && floatGrade < 62.5) allClassGPA.push(0.7);
                    if(floatGrade >= 62.5 && floatGrade < 66.5) allClassGPA.push(1);
                    if(floatGrade >= 66.5 && floatGrade < 69.5) allClassGPA.push(1.3);
                    if(floatGrade >= 69.5 && floatGrade < 72.5) allClassGPA.push(1.7);
                    if(floatGrade >= 72.5 && floatGrade < 76.5) allClassGPA.push(2);
                    if(floatGrade >= 76.5 && floatGrade < 79.5) allClassGPA.push(2.3);
                    if(floatGrade >= 79.5 && floatGrade < 82.5) allClassGPA.push(2.7);
                    if(floatGrade >= 82.5 && floatGrade < 86.5) allClassGPA.push(3);
                    if(floatGrade >= 86.5 && floatGrade < 89.5) allClassGPA.push(3.3);
                    if(floatGrade >= 89.5 && floatGrade < 92.5) allClassGPA.push(3.7);
                    if(floatGrade >= 92.5 && floatGrade < 96.5) allClassGPA.push(4);
                    if(floatGrade > 96.5) allClassGPA.push(4.3);

                    if(allClassGPA.length >= allGradeDetails.length)
                    {
                      let sum = 0;
                      for(let i = 0; i < allClassGPA.length; i++)
                      {
                        sum += allClassGPA[i];
                      }
                      let GPA = roundToHundredths(sum/allClassGPA.length)
                      console.log(floatGrade + "  " + GPA);
                      console.log(allGrades);
                      let textBox;

                      if(!textBoxCreated)
                      {
                      textBox = document.createElement("textarea");
                      textBox.id = "GPATextBox";
                      textBox.rows = 5;
                      textBox.cols = 30;
                      textBox.style.position = "fixed"; // Example styling: fixed position
                      textBox.style.bottom = "10px";   // Position at the bottom of the viewport
                      textBox.style.right = "10px";    // Align to the right side of the viewport
                      textBox.style.zIndex = "10000";  // Ensure it's visible above other elements

            // Add text to the text box
                      textBox.setAttribute("readonly", true);
                      textBox.value = "Unweighted GPA: " + GPA;

            // Insert the text box into the DOM
                      document.body.appendChild(textBox);
                      console.log("Text box successfully added to the webpage.");
                      console.log(textBox);
                      textBoxCreated = true;
                    }
                    textBox = document.querySelector('#GPATextBox')
                    textBox.value = "Unweighted GPA: " + GPA;
                    }
                  });

                }
                // Perform desired operations on the element with textContent
            } else {
                console.log(element[0] + ` ${index + 1} has no textContent yet.`);
            }
        });
    }

    function roundToHundredths(number) {
  return Math.round(number * 100) / 100;
}
