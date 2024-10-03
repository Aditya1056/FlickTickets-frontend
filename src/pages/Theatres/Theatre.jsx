import React from "react";

import { useParams } from "react-router-dom";

import SingleTheatre from "../../components/theatres/SingleTheatre/SingleTheatre";

const Theatre = (props) => {

    const params = useParams();

    const theatreId = params.theatreId;

    return (
        <SingleTheatre id={theatreId} />
    );
}

export default Theatre;