export default function ({ $auth }) {
  if ($auth.loggedIn) {
    const user = $auth.$storage.getUniversal('user')
    $auth.setUser(user)
  }
}
