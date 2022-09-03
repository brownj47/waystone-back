const friends = [0,1,2,5,6,7,9]

const randUserFetch = () => {
	const randUser = Math.floor(Math.random()*10)
	return randUser
}

//given one user, returns true if request sent, false if not
const randUserFriendCheck = (friends) => {
	let randUser = randUserFetch()
		if (!friends.includes(randUser)){
		return randUser
		} else {
			return randUserFriendCheck(friends)
		}
	}
	
console.log(randUserFriendCheck(friends))