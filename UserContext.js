import React,{ createContext, useReducer, useContext } from 'react';

const UserContext = createContext(null);
const UserDispatchContext = createContext(null);

export default function UserProvider({children}) {
  const [user, dispatch] = useReducer(userReducer, initialUser);
  
  return (
  <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

const initialUser = {
  name: "",
    displayName: "",
    emailAddress: "",
    JSESSIONID: "",
    key: "",
    accessToken: "",
    refreshToken: "",
    role: "ANONYMOUS"
}

function userReducer(user, action) {
  switch (action.type) {
    case 'login': {
      return {...user, ...action.data};
    }
    case 'refreshToken': {
      return {...user, accessToken: action.accessToken};
    }
    case 'logout': {
      return initialUser;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}


/*
dispatch({
  type: 'login',
  data: {
    accessToken: 'data',
    refreshToken: 'data',
    email: 'data',
    phone: 'data',
    full_name: 'Hoang Nguyen',
    role: 'STAFF',
  },
})

dispatch({
  type: 'refreshToken',
  accessToken: 'data',
})

dispatch({
  type: 'logout',
})

*/