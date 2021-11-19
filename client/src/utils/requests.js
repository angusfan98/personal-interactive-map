export async function fetchPins(email) {
  return new Promise(function(resolve, reject) {
    fetch('http://localhost:3001/pins',{
      method:'POST',
      body: email,
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow'
      },
      mode:'cors'
    }).then(function(res) {
        resolve(res.json());
    });
  })
}

export async function deletePin(email, target) {
  var body = 'email='+`${email}`+'&target='+`${target}`;
  return new Promise(function(resolve, reject) {
    fetch('http://localhost:3001/pins/delete',{
      method:'POST',
      body: body,
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow'
      },
      mode:'cors'
    }).then(function(res) {
        resolve(res.json());
    });
  })
}

export async function confirmPin(email, lat, lng, address, desc,have_visited,interested,titles) {
  var body = 'email='+`${email}`+'&lat='+`${lat}`+'&lng='+`${lng}`+'&address='+`${address}`+'&desc='+`${desc}`+'&have_visited='+`${have_visited}`+'&interested='+`${interested}`+'&titles='+`${titles}`;
  return new Promise(function(resolve, reject) {
    fetch('http://localhost:3001/pins/add',{
      method:'POST',
      body: body,
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow'
      },
      mode:'cors'
    }).then(function(res) {
        resolve(res.json());
    });
  })
}

export async function updatePin(email, target, desc,have_visited,interested,titles) {
  var body = 'email='+`${email}`+'&target='+`${target}`+'&desc='+`${desc}`+'&have_visited='+`${have_visited}`+'&interested='+`${interested}`+'&titles='+`${titles}`;
  return new Promise(function(resolve, reject) {
    fetch('http://localhost:3001/pins/update',{
      method:'POST',
      body: body,
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow'
      },
      mode:'cors'
    }).then(function(res) {
        resolve(res.json());
    });
  })
}

export async function fetchFriends(email) {
  return new Promise(function(resolve, reject) {
    fetch('http://localhost:3001/friends',{
      method:'POST',
      body: email,
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow'
      },
      mode:'cors'
    }).then(function(res) {
        resolve(res.json());
    });
  })
}

export async function addFriend(email, friendName, friendEmail) {
  var body = 'email='+`${email}`+'&name='+`${friendName}`+'&friendEmail='+`${friendEmail}`;
  return new Promise(function(resolve, reject) {
    fetch('http://localhost:3001/friends/add',{
      method:'POST',
      body: body,
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow'
      },
      mode:'cors'
    }).then(function(res) {
        resolve(res.json());
    });
  })
}

export async function addImage(email, title, caption, imageString) {
  var body = 'email='+`${email}`+'&title='+`${title}`+'&caption='+`${caption}`+'&imageString='+`${imageString}`;
  return new Promise(function(resolve, reject) {
    fetch('http://localhost:3001/images/add',{
      method:'POST',
      body: body,
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow'
      },
      mode:'cors'
    }).then(function(res) {
        // resolve(res.json());
    });
  })
}

export async function fetchImages(email) {
  return new Promise(function(resolve, reject) {
    fetch('http://localhost:3001/images',{
      method:'POST',
      body: email,
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow'
      },
      mode:'cors'
    }).then(function(res) {
        resolve(res.json());
    });
  })
}