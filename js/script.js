import { PRODUCTS, DB } from "./data.js";

const USERS = DB;
let indexUserInSession = USERS.findIndex((user) => Boolean(user.status));

////// THIS IS FOR TEST only (code-start)
const userIvan = {
    name: "Ivan",
    email: "ivan@gmail.com",
    password: "123",
    favourites: [9, 18, 7, 2, 4],
    orders: [
        { id: 2, count: 2 },
        { id: 16, count: 4 },
        { id: 1, count: 1 },
        { id: 8, count: 3 },
    ],
    status: false,
};

if (USERS.findIndex((user) => user.email === userIvan.email) < 0) {
    USERS.push(userIvan);
    localStorage.setItem("users", JSON.stringify(USERS));
}
////// THIS IS FOR TEST only (code-end)

/**
 * Registartion FORM
 */
const registrationForm = document.querySelector("#RegistrationForm");
if (registrationForm) {
    registrationForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const error = e.target.querySelector(".error");
        const name = e.target.querySelector('input[data-name="name"]').value;
        const email = e.target.querySelector('input[data-name="email"]').value;
        const password = e.target.querySelector(
            'input[data-name="password"]'
        ).value;
        const passwordVerify = e.target.querySelector(
            'input[data-name="passwordVerify"]'
        ).value;

        error.classList.remove("active");

        if (password !== passwordVerify) {
            error.innerText = "Passwords do not match";
            error.classList.add("active");

            return;
        }

        const userExist = USERS.find(
            (item) => item.email === email.trim().toLocaleLowerCase()
        );

        if (userExist) {
            error.innerText = `User with email ${email} already exists!`;
            error.classList.add("active");

            return;
        }

        const user = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            status: true,
            favourites: [],
            orders: [],
        };

        USERS.forEach((value) => (value.status = false));
        USERS.push(user);

        localStorage.setItem("users", JSON.stringify(USERS));

        document.location.href = "account.html";
    });
}

//
// LOGIN FORM
//
const LoginForm = document.querySelector(`#LoginForm`);
if (LoginForm) {
    LoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        USERS.forEach((value) => (value.status = false));
        localStorage.setItem("users", JSON.stringify(USERS));

        const error = e.target.querySelector(".error");
        const email = e.target.querySelector("input[data-name='email']").value;
        const password = e.target.querySelector(
            "input[data-name='password']"
        ).value;

        const indexLoginnedUser = USERS.findIndex((user) => {
            if (
                user.email === email.trim().toLocaleLowerCase() &&
                user.password === password
            ) {
                return true;
            }
        });

        error.classList.remove("active");

        if (indexLoginnedUser < 0) {
            error.classList.add("active");

            return;
        }

        USERS[indexLoginnedUser].status = true;

        localStorage.setItem("users", JSON.stringify(USERS));

        document.location.href = "account.html";
    });
}

//
// HEADER
//
document.addEventListener("DOMContentLoaded", (e) => {
    const headerUser = document.querySelector(`#headerUser`);
    const headerFavourites = document.querySelector(`#headerFavourites`);
    const headerFavouritesCount = document.querySelector(
        `#headerFavouritesCount`
    );

    const headerLogout = document.querySelector(`#headerLogout`);
    const userInfoEmail = document.querySelector("#userInfoEmail");

    if (indexUserInSession >= 0) {
        headerUser.href = `account.html`;
        headerUser.innerText = USERS[indexUserInSession].name;

        headerFavourites.href = `favourites.html`;

        headerFavouritesCount.innerText =
            USERS[indexUserInSession].favourites?.length ?? 0;

        userInfoEmail &&
            (userInfoEmail.innerText = USERS[indexUserInSession].email);

        headerLogout.classList.add(`active`);
        headerLogout.addEventListener("click", (e) => {
            e.preventDefault();
            USERS[indexUserInSession].status = false;
            localStorage.setItem("users", JSON.stringify(USERS));
            document.location.href = "login.html";
        });
    }
});

//
// Account.html ordered items
//
const orderTable = document.querySelector(`#orderTable`);
if (orderTable && indexUserInSession >= 0) {
    USERS[indexUserInSession].orders.forEach((order) => {
        const tr = document.createElement("tr");
        const product = PRODUCTS.find((product) => order.id === product.id);

        tr.innerHTML = `<td><div class="item__info"><img src="images/products/${
            product.img
        }.png" alt="${
            product.title
        }" height="100"><div><p class="item__info--title">${
            product.title
        }</p></div></div></td><td>$${
            product.price
        }</td><td><span class="item__sale">- ${
            product.sale ? product.salePercent + "%" : ""
        }</span></td><td>${order.count}</td><td>$${
            (product.price -
                (product.sale
                    ? (product.price * product.salePercent) / 100
                    : 0)) *
            order.count
        }</td>`;

        orderTable.appendChild(tr);
    });
}

//
// Account.html - name Change
//
const userInfo = document.querySelector("#userInfo");
if (userInfo) {
    userInfo.addEventListener("submit", (e) => {
        e.preventDefault();

        const newName = e.target.querySelector("input").value;
        USERS[indexUserInSession].name = newName;
        localStorage.setItem("users", JSON.stringify(USERS));
        window.location.reload();
    });
}

const deleteAcc = document.querySelector("#deleteAcc");
if (deleteAcc) {
    deleteAcc.addEventListener("click", (e) => {
        if (indexUserInSession >= 0) {
            USERS.splice(indexUserInSession, 1);
            localStorage.setItem("users", JSON.stringify(USERS));
        }
        document.location.href = "login.html";
    });
}

//
// INDEX.html - goods generator
//
const categoriesContainer = document.querySelector("#categoriesContainer");
const productSectionsMap = {};

if (categoriesContainer) {
    PRODUCTS.forEach((product) => {
        product.categories.forEach((category) => {
            const productLayout = document.createElement("div");
            productLayout.classList.add("product");
            productLayout.innerHTML = `<button class="product__favourite">
        <img src="images/product__favourite${
            indexUserInSession >= 0 &&
            USERS[indexUserInSession].favourites.includes(product.id)
                ? "--true"
                : ""
        }.png" data-product_id="${product.id}" alt="favourite" height="20">
    </button>
    <img src="images/products/${product.img}.png" class="product__img" alt="${
                product.title
            }" height="80">
    <p class="product__title">${product.title}</p>
    ${
        product.sale
            ? `<div class="product__sale">
                <span class="product__sale--old">$${product.price}</span>
                <span class="product__sale--percent">- ${
                    product.salePercent + "%"
                }</span>
            </div>`
            : ""
    }
    <div class="product__info">
        <span class="product__price">$${
            product.sale
                ? product.price - (product.price * product.salePercent) / 100
                : product.price
        }</span>
    </div>`;

            if (!productSectionsMap[category]) {
                const categorySection = document.createElement("section");
                categorySection.classList.add("category");

                categorySection.dataset.name = category;
                categorySection.innerHTML = `<h2>${category}</h2>`;

                const divContainer = document.createElement("div");
                divContainer.classList.add("category__container");
                categorySection.appendChild(divContainer);

                categoriesContainer.appendChild(categorySection);

                productSectionsMap[category] = divContainer;
            }
            productSectionsMap[category].appendChild(productLayout);
        });
    });
}

const favouritesAll = document.querySelectorAll(".product__favourite");
if (favouritesAll && indexUserInSession < 0) {
    favouritesAll.forEach((favourite) => {
        favourite.addEventListener("click", (e) => {
            e.preventDefault();

            document.location.href = "login.html";
        });
    });
}
if (favouritesAll && indexUserInSession >= 0) {
    favouritesAll.forEach((favourite) => {
        favourite.addEventListener("click", (e) => {
            e.preventDefault();
            const product_id = e.target.dataset.product_id;

            if (product_id) {
                if (
                    USERS[indexUserInSession].favourites.includes(
                        parseInt(product_id)
                    )
                ) {
                    const index = USERS[
                        indexUserInSession
                    ].favourites.findIndex(
                        (value) => value === parseInt(product_id)
                    );

                    USERS[indexUserInSession].favourites.splice(index, 1);

                    e.target.src = `images/product__favourite.png`;
                } else {
                    USERS[indexUserInSession].favourites.push(
                        parseInt(product_id)
                    );
                    e.target.src = `images/product__favourite--true.png`;
                }

                document.querySelector(`#headerFavouritesCount`).innerText =
                    USERS[indexUserInSession].favourites?.length ?? 0;

                localStorage.setItem("users", JSON.stringify(USERS));
            }
        });
    });
}

//
// favourites.html
//
const favouriteTable_tbody =
    document.querySelector("#favouriteTable")?.children[2];

function renderFavouriteTable(user, tagToAppend) {
    user.favourites.forEach((favouriteOrderID) => {
        const favouriteProduct = PRODUCTS.find(
            (product) => product.id === favouriteOrderID
        );

        const tr = document.createElement("tr");
        tr.innerHTML = `<td>
                        <div class="item__info">
                            <img src="images/products/${
                                favouriteProduct.img
                            }.png" alt="${favouriteProduct.title}" height="100">
                            <div>
                                <p class="item__info--title">${
                                    favouriteProduct.title
                                }</p>
                            </div>
                        </div>
                    </td>
                    <td>$${favouriteProduct.price}</td>
                    <td>${
                        favouriteProduct.sale
                            ? "<span class='item__sale'>- " +
                              favouriteProduct.salePercent +
                              "%" +
                              "</span>"
                            : "-"
                    }</td>
                    <td>$${
                        favouriteProduct.sale
                            ? favouriteProduct.price -
                              (favouriteProduct.price *
                                  favouriteProduct.salePercent) /
                                  100
                            : favouriteProduct.price
                    }</td>
                    <td>
                        <button class="item__favourite"><img src="images/product__favourite--true.png" alt="favourite" height="20"  data-product_id="${
                            favouriteProduct.id
                        }"></button>
                    </td>`;

        tagToAppend.appendChild(tr);
    });

    const favouriteButtons = document.querySelectorAll(".item__favourite");

    favouriteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productID = parseInt(e.target.dataset.product_id);

            if (productID) {
                const index = USERS[indexUserInSession].favourites.findIndex(
                    (value) => value === productID
                );

                USERS[indexUserInSession].favourites.splice(index, 1);
                localStorage.setItem("users", JSON.stringify(USERS));
                document.querySelector(`#headerFavouritesCount`).innerText =
                    USERS[indexUserInSession].favourites?.length ?? 0;

                favouriteTable_tbody.innerHTML = "";
                renderFavouriteTable(user, tagToAppend);
            }
        });
    });
}

if (favouriteTable_tbody && indexUserInSession >= 0) {
    renderFavouriteTable(USERS[indexUserInSession], favouriteTable_tbody);
}
