// async componentDidMount(){
//     let id = await AsyncStorage.getItem('userID');
//     let sessionToken = await AsyncStorage.getItem('token');

//     this.setState({
//         userID: id,
//         token: sessionToken 
//       })

//     if(sessionToken != null)
//     {
//         sessionToken = sessionToken.replaceAll('"', '');
//     }
//     else
//     {
//         return null;
//     }

//     return fetch('http://localhost:3333/api/1.0.0/user/' + id, 
//     {
//         method: 'GET',
//         headers: {
//             'X-Authorization': sessionToken
//           }
//     })
//     .then((response) => {
//         if(response.status == 200){
//           return response.json()
//         }
//         else if(response.status == 400){
//           throw 'Failed validation';
//         }
//         else{
//           throw 'Something went wrong';
//         }
//     })
//     .then(async (responseJson) => {
//         await AsyncStorage.setItem("userID", JSON.stringify(responseJson.id));
//         await AsyncStorage.setItem("token", JSON.stringify(responseJson.token));
//     })
//     .then((responseJson) => {
//         console.log(responseJson);
//     })
    
// }