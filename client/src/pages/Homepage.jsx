import React, { useState } from "react";

const Homepage = props => {
    const [username, setUsername] = useState("");

    const onChange = ({ target: { value } }) => setUsername(value);

    const onClick = () => {
        fetch(`/api/getData/${hashtag}`)
            .then(res => res.json())
            .then(data => {
                console.log("data", data);
            });
    };

    return (
        <div>
            Time to start coding!
            <input value={hashtag} onChange={onChange} />
            <button onClick={onClick}>Get instagram followers!</button>
        </div>
    );
};

export default Homepage;