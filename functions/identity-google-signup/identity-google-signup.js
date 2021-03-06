const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const { user } = JSON.parse(event.body);

  const responseBodyString = JSON.stringify({
    query: `
    mutation insertUser($id: String, $email:String, $name:String){
      insert_user(objects: {id: $id, email: $email, name: $name}) {
        affected_rows
      }
    }    
  `,
    variables: {
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name
    }
  });

  console.log(responseBodyString);

  const result = await fetch(
    "https://retroboard-react-firebase.herokuapp.com/v1/graphql",
    {
      method: "POST",
      body: responseBodyString,
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "V5h28RpKGoNF"
      }
    }
  );
  const { errors, data } = await result.json();

  if (errors) {
    console.log(errors);
    return {
      statusCode: 500,
      body: "Something is wrong"
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify(responseBody)
    };
  }
};
