const apiUrl = "https://654232d8f0b8287df1ffac32.mockapi.io/users";

const results = document.getElementById("results");

function ShowResults(user) {
  let li = document.createElement("li");
  li.classList.add("list-group-item", "bg-secondary", "text-white");
  li.innerHTML = `ID: ${user.id} <br/> Nombre: ${user.name} ${user.last}`;
  results.appendChild(li);
}

async function getUsers() {
  let users = [];
  await fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta no fue correcta");
      }
      return response.json();
    })
    .then((data) => {
      users = data;
    })
    .catch((error) => {
      console.error("Hubo un problema:", error);
    });
  return users;
}

async function getUserById(id) {
  let user = {};
  await fetch(`${apiUrl}/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta no fue correcta");
      }
      return response.json();
    })
    .then((data) => {
      user = data;
    })
    .catch((error) => {
      console.error("Hubo un problema:", error);
    });
  return user;
}

const BtnFindUser = document.getElementById("btnGet1");

BtnFindUser.addEventListener("click", async () => {
  verifyInputs([document.getElementById("inputGet1Id")]);

  if (document.getElementById("inputGet1Id").value.trim() === "") return;

  results.innerHTML = "";

  const id = document.getElementById("inputGet1Id").value;
  const user = await getUserById(id);

  ShowResults(user);
});

async function createUser(name, last) {
  const user = {
    name: name,
    last: last,
  };

  let createdUser = {};

  await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta no fue correcta");
      }
      return response.json();
    })
    .then((data) => {
      createdUser = data;
    })
    .catch((error) => {
      console.error("Hubo un problema:", error);
    });

  return createdUser;
}
const inputPostNombre = document.getElementById("inputPostNombre");
const inputPostApellido = document.getElementById("inputPostApellido");
const inputsPOST = [inputPostNombre, inputPostApellido];

function showValidation(input) {
  if (input.value.trim() === "") {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}
function verifyInputs(inputs) {
  inputs.forEach((element) => {
    showValidation(element);
    element.addEventListener("input", (e) => {
      showValidation(e.target);
    });
  });
}

const BtnCreateUser = document.getElementById("btnPost");

BtnCreateUser.addEventListener("click", async () => {
  results.innerHTML = "";

  const name = inputPostNombre.value;
  const last = inputPostApellido.value;

  verifyInputs(inputsPOST);

  if (name.trim() === "" || last.trim() === "") {
    return;
  }

  await createUser(name, last);

  const users = await getUsers();

  users.forEach((user) => {
    ShowResults(user);
  });

  inputsPOST.forEach((element) => {
    element.value = "";
    element.classList.remove("is-valid");
    element.classList.remove("is-invalid");
  });
});

async function deleteUser(id) {
  user = {};

  await fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta no fue correcta");
      }
      return response.json();
    })
    .then((data) => {
      user = data;
    })
    .catch((error) => {
      console.error("Hubo un problema:", error);
    });

  return user;
}

const inputDelete = document.getElementById("inputDelete");

const BtnDeleteUser = document.getElementById("btnDelete");

BtnDeleteUser.addEventListener("click", async () => {
  results.innerHTML = "";

  verifyInputs([inputDelete]);

  if (inputDelete.value.trim() === "") return;

  const id = inputDelete.value;

  await deleteUser(id);

  const users = await getUsers();

  users.forEach((user) => {
    ShowResults(user);
  });

  inputDelete.value = "";
  inputDelete.classList.remove("is-valid");
  inputDelete.classList.remove("is-invalid");
});

async function ModifyUser(id, newName, newLast) {
  const ModifiedUser = {
    name: newName,
    last: newLast,
  };

  let user = {};

  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    body: JSON.stringify(ModifiedUser),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta no fue correcta");
      } else return response.json();
    })
    .then((data) => {
      user = data;
    })
    .catch((error) => {
      console.error("Hubo un problema:", error);
    });

  return user;
}

const BtnModifyUser = document.getElementById("btnPut");
const inputPutId = document.getElementById("inputPutId");
const myModal = document.getElementById("myModal");

BtnModifyUser.addEventListener("click", async () => {
  myModal.querySelector(".modal-body").innerHTML = ``;
  verifyInputs([inputPutId]);

  let user = {};
  const emptyObject = {};

  const id = inputPutId.value;

  user = await getUserById(id);

  if (
    id === "" ||
    user.id === undefined ||
    user.last === undefined ||
    user.name === undefined ||
    user === emptyObject
  ) {
    myModal.querySelector(
      ".modal-body"
    ).innerHTML = `<p class='text-danger'> Usuario no encontrado <p/>`;
    document.getElementById("btnSaveChanges").disabled = true;
    return;
  } else {
    myModal.querySelector(".modal-body").innerHTML = `<form class="form">
                      <div class="form-group">
                        <label for="inputPutNombre">Nombre:</label>
                        <input
                          type="text"
                          id="inputPutNombre"
                          class="form-control my-1"
                        />
                        <label for="inputPutApellido">Apellido:</label>
                        <input
                          type="text"
                          id="inputPutApellido"
                          class="form-control my-1"
                        />
                      </div>
                    </form>`;
    document.getElementById("btnSaveChanges").disabled = false;
  }

  document.getElementById("inputPutNombre").value = user.name;
  document.getElementById("inputPutApellido").value = user.last;

  [
    document.getElementById("inputPutNombre"),
    document.getElementById("inputPutApellido"),
  ].forEach((input) => {
    let state = showValidation(input);
    input.addEventListener("input", (e) => {
      state = showValidation(e.target);
      if (state) {
        document.getElementById("btnSaveChanges").disabled = false;
      } else {
        document.getElementById("btnSaveChanges").disabled = true;
      }
    });
  });
});

document
  .getElementById("btnSaveChanges")
  .addEventListener("click", async () => {
    results.innerHTML = "";

    const id = inputPutId.value;
    const newName = document.getElementById("inputPutNombre").value;
    const newLast = document.getElementById("inputPutApellido").value;

    verifyInputs([
      document.getElementById("inputPutNombre"),
      document.getElementById("inputPutApellido"),
    ]);

    await ModifyUser(id, newName, newLast);

    inputPutId.value = "";
    inputPutId.classList.remove("is-valid", "is-invalid");
    document.getElementById("inputPutNombre").value = "";
    document.getElementById("inputPutApellido").value = "";

    const users = await getUsers();

    users.forEach((user) => {
      ShowResults(user);
    });
  });
