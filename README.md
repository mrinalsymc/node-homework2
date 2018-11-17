#APIs

## /users
This can be used to create, edit and delete a user

### Creating a user
```
curl -X POST \
  http://localhost:3000/users \
  -d '{
	"name":"mrinal",
	"email":"mrinalr@gmail.com",
	"address":"Some address",
	"password":"qwer1234"
}'
```

### Editing a user

* For editing, the user needs to `/login` first, which will provide `token`.
* `email` is mandatory, `address`, `name`, `password` are optional but at least one need to be present.

```
curl -X PUT \
  http://localhost:3000/users \
  -H 'token: lh09fkrxpli24ds2e7lo' \
  -d '{
	"email":"mrinalr@gmail.com",
	"address":"some address1",
	"name":"mrinal_khanvilkar1",
	"password":"qwer1234"
}'
```

### Deleting a user

* For deleting, the user needs to `/login` first, which will provide `token`.

```
curl -X DELETE \
  http://localhost:3000/users \
  -H 'token: lh09fkrxpli24ds2e7lo'
```

## /login

```
curl -X POST \
  http://localhost:3000/login \
  -d '{
	"email":"mrinalr@gmail.com",
	"password":"qwer1234"
}'
```
This will return the following response
```
{"Data":{"id":"vsw3qpxc36ueuc8ibhpz","expires":1542440122569,"email":"mrinalr@gmail.com"}}
```
the `id` is the `token` which needs to be passed for any further actions

## /logout
* For logging out, the user needs to `/login` first, which will provide `token`.

```
curl -X GET \
  http://localhost:3000/logout \
 -H 'token: vsw3qpxc36ueuc8ibhpz'
```

## /menu

* For getting a menu, the user needs to `/login` first, which will provide `token`.

```
 curl -X GET \
  http://localhost:3000/menu \
  -H 'token: w9sck8bx9ti345mhselv'
```

## /shoppingcart

### Adding an item in the shopping cart

* For adding/editing the shopping cart, the user needs to `/login` first, which will provide `token`.

```
curl -X POST \
  http://localhost:3000/shoppingcart \
  -H 'token: w9sck8bx9ti345mhselv' \
  -d '{
	"menuItemId":"p3",
	"quantity":1
}'
```

### Getting the items from the shopping cart
* For getting the shopping cart, the user needs to `/login` first, which will provide `token`.

```
curl -X GET \
  http://localhost:3000/shoppingcart \
  -H 'token: zfb3zsv6m9jhpktxii2m'
```


### Editing/Deleting items in the shopping cart
* For deleting an item, simply pass `quantity = 0` below

```
curl -X PUT \
  http://localhost:3000/shoppingcart \
  -H 'token: w9sck8bx9ti345mhselv' \
  -d '{
	"menuItemId":"p3",
	"quantity":4
}'
```

## /checkout

Also the user is assumed to be logged in already and thus will be provided with a `token`.

This also assumes that `stripe` has already processed the users paument information and returned a `Stripe token`. For reference look at https://stripe.com/docs/quickstart

```
curl -X POST \
  http://localhost:3000/checkout \
  -H 'token: w9sck8bx9ti345mhselv' \
  -d '{
	"sourceToken":"tok_visa"
}'
```
We are using a test `Stripe token = tok_visa` in our case.

Once the payment is done a mail will be sent to the users email along with the items which the user had added. Also the shopping cart will be deleted.
