import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

export default class ProfileTabs extends Component {
  render() {
    const { following, followers } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">Followers</h3>
            <hr />
            {followers.map((person, i) => (
              <div key={i}>
                <Link to={`/user/${person._id}`}>
                  <img
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black"
                    }}
                    className="float-left mr-2"
                    height="40px"
                    width="40px"
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                    alt={person.name}
                    onError={i => (i.target.src = `${DefaultProfile}`)}
                  />
                  <div>
                    <p className="lead">{person.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <h3 className="text-primary">Following</h3>
            <hr />

            {following.map((person, i) => (
              <div key={i}>
                <div>
                  <Link to={`/user/${person._id}`}>
                    <img
                      style={{
                        borderRadius: "50%",
                        border: "1px solid black"
                      }}
                      className="float-left mr-2"
                      height="40px"
                      width="40px"
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                      alt={person.name}
                      onError={i => (i.target.src = `${DefaultProfile}`)}
                    />
                    <div>
                      <p className="lead">{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Posts</h3>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

// export default class ProfileTabs extends Component {
//   render() {
//     console.log(this.props, "these are the props");
//     const { following, followers } = this.props;
//     following === null || followers === null
//       ? console.log("props not loaded")
//       : console.log("props loaded");
//     return (
//       <div>
//         <div className="row">
//           <div className="col-md-4">
//             <h3 className="text-primary">Followers</h3>
//             <hr />
//             {followers.map((person, i) => (
//               <div key={i}>
//                 <Link to={`/user/${person._id}`}>
//                   {console.log(person, "person")}
//                   <img
//                     style={{
//                       borderRadius: "50%",
//                       border: "1px solid black"
//                     }}
//                     className="float-left mr-2"
//                     height="40px"
//                     width="40px"
//                     src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
//                     alt={person.name}
//                     onError={i => (i.target.src = `${DefaultProfile}`)}
//                   />
//                   <div>
//                     <p className="lead">{person.name}</p>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>

//           <div className="col-md-4">
//             <h3 className="text-primary">Following</h3>
//             <hr />

//             {following.map((person, i) => (
//               <div key={i}>
//                 <div>
//                   <Link to={`/user/${person._id}`}>
//                     <img
//                       style={{
//                         borderRadius: "50%",
//                         border: "1px solid black"
//                       }}
//                       className="float-left mr-2"
//                       height="40px"
//                       width="40px"
//                       src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
//                       alt={person.name}
//                       onError={i => (i.target.src = `${DefaultProfile}`)}
//                     />
//                     <div>
//                       <p className="lead">{person.name}</p>
//                     </div>
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="col-md-4">
//             <h3 className="text-primary">Posts</h3>
//             <hr />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
