import React from "react";
import { Link } from "react-router";

function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Oops! The page you’re looking for does not exist.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  );
}

export default NotFound;