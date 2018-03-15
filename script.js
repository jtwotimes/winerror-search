function execute() {
    const terms = document.getElementById('searchTerms').value.toUpperCase().split(' ');
    const sanitizedTerms = [];

    terms.forEach(term => {
        if (/^[a-zA-Z0-9]+$/.test(term)) {
            if (term.startsWith("0X")) {
                term = term.replace("0X", "0x");
            }
        
            sanitizedTerms.push(term);
        }
    });

    if (sanitizedTerms.length === 0)
        return;

    const db = firebase.firestore();
    let colRef = db.collection('errors');

    const queries = [];
    queries.push(...sanitizedTerms.map(term => colRef.where(`SearchTerms.${term}`, '==', true).get()));

    destroyExistingTable();

    Promise.all(queries).then((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((queryResult) => {
            queryResult.forEach((doc) => {
                results.push({
                    code: doc.data().Code,
                    description: doc.data().Description,
                    name: doc.data().Name
                });
            })
        });

        createAndPopulateTable(results);
    }, (reason) => console.log(reason))
    .catch((error) => console.log("Error getting documents: ", error));
}

function createAndPopulateTable(data) {
    const table = document.getElementById("searchTable");
    data.forEach(searchResult => {
        let code = document.createElement("td");
        code.innerText = searchResult.code;

        let name = document.createElement("td");
        name.innerText = searchResult.name;

        let description = document.createElement("td");
        description.innerText = searchResult.description;

        let row = document.createElement("tr");
        row.appendChild(code)
        row.appendChild(name)
        row.appendChild(description);
        table.appendChild(row);
    });
}

function destroyExistingTable() {
    document.getElementById("searchTable").innerHTML = startingTable;
}

const startingTable = document.getElementById("searchTable").innerHTML;

firebase.initializeApp({
    apiKey: "AIzaSyCwCTqoXWLDeWxvPhz8JEHmlJ7bgLJD678",
    authDomain: "ng-winerror.firebaseapp.com",
    databaseURL: "https://ng-winerror.firebaseio.com",
    projectId: "ng-winerror",
    storageBucket: "ng-winerror.appspot.com",
    messagingSenderId: "112464726726"
});