| API Name          | Method | URL                                                   | Body Parameters     | Description                                                      |
| ----------------- | ------ | ----------------------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| Admin Login       | POST   | `http://127.0.0.1:5000/api/v1/auth/admin-login`       | `email`, `password` | Logs in an admin user. Returns a JWT token stored in cookies.    |
| Invigilator Login | POST   | `http://127.0.0.1:5000/api/v1/auth/invigilator-login` | `email`, `password` | Logs in an invigilator. Returns a JWT token stored in cookies.   |
| Logout            | GET    | `http://127.0.0.1:5000/api/v1/auth/logout`            | –                   | Logs out the currently logged-in user by clearing the JWT token. |
| API Name                | Method | URL                                                       | Body Parameters                     | Description                                                         |
| ----------------------- | ------ | --------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| Add Invigilator         | POST   | `http://127.0.0.1:5000/api/v1/invigilator/add`            | `name`, `email`, `password`         | Adds a new invigilator. Only accessible by users with `ADMIN` role. |
| Get Invigilator Profile | GET    | `http://127.0.0.1:5000/api/v1/invigilator/profile`        | –                                   | Returns the profile details of the currently logged-in invigilator. |
| Update Profile          | PUT    | `http://127.0.0.1:5000/api/v1/invigilator/update-profile` | Any of: `name`, `email`, `password` | Updates the profile of the currently logged-in invigilator.         |
