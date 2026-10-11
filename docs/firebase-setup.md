# Setting up Firebase (admins and the added tabs)

The site stays on GitHub Pages. Firebase, on its free **Spark** plan, adds two things:

- **Sign-in** for the site's admins (email and password).
- **A database** for the tabs the admins write on each name's page: «استخداماته», «أدعية متعلقة به»,
  «قصة حول الاسم», «الربط بين الاسم وواقع الحياة» and «الأثر الإيماني بالاسم».

Everyone can read the tabs; only admins can change them. The database's own rules
([`firestore.rules`](../firestore.rules)) enforce this on Google's servers, whatever happens in the browser.

The free plan needs no credit card. Do not upgrade to the paid **Blaze** plan; nothing here needs it.

## 1. Create the project

1. Go to <https://console.firebase.google.com> and sign in with your Google account.
2. **Create a project** (or **Add project**). Any name will do, for example `asmaa-alhusna`.
3. Google Analytics is not needed: turn it off, then **Create project**.

## 2. Register the website

1. On the project's home page, click the **Web** icon (`</>`).
2. Give it a nickname, for example `site`. Leave **Firebase Hosting** unticked.
3. Click **Register app**. Firebase shows a `firebaseConfig` with `apiKey`, `authDomain`, `projectId` and
   a few more values. Copy it into [`src/app/core/firebase/firebase.config.ts`](../src/app/core/firebase/firebase.config.ts)
   in place of `null`, or send it to whoever maintains the site.

These values are not secret: they only say which project the site talks to. What anyone may do is decided
by the rules in step 5.

## 3. Turn on email sign-in

1. **Build → Authentication → Get started**.
2. **Sign-in method → Email/Password**: turn on the first switch only (leave **Email link** off), then **Save**.
3. **Settings → Authorized domains → Add domain**: add `hosam9988.github.io`. (`localhost` is already there.)
4. If **Settings → User actions** is shown, untick **Enable create (sign-up)** and save, so that nobody can
   create an account from outside. Admins' accounts are created by you, in step 6. (Even without this, a
   stranger's account could not change anything, as it is not on the admins list.)

## 4. Create the database

1. **Build → Firestore Database → Create database**.
2. Choose a location near the readers, for example `me-central2` (Dammam) if it is listed, otherwise `eur3`
   (Europe). The location cannot be changed later.
3. Start in **production mode**, then **Create**.

## 5. Publish the rules

1. **Firestore Database → Rules**.
2. Replace everything there with the whole of [`firestore.rules`](../firestore.rules).
3. **Publish**.

## 6. Add an admin

1. **Authentication → Users → Add user**: the admin's email and a password, then **Add user**.
2. In the list of users, copy that account's **User UID**.
3. **Firestore Database → Data → Start collection**. Collection ID: `admins`.
4. Document ID: paste the **User UID**. Add one field, `name` (string), with the admin's name, then **Save**.

To add another admin, repeat these steps (in step 3, add a document to the existing `admins` collection).
To remove an admin, delete their document from `admins`.

## 7. Tell the admin

- Sign in at <https://hosam9988.github.io/asmaa-alhusna/admin>, or through the **دخول المشرف** link at the
  bottom of every page, with the email and password from step 6.
- Then open any name's page, choose one of its added tabs, and press **إضافة محتوى** or **تعديل**.
  Paragraphs are separated by an empty line, a line starting with `#` is a heading, and verses go between
  ﴿ ﴾. What is saved appears to visitors straight away.
- **نسيت كلمة المرور؟** on the sign-in page emails a link to set a new password.

## Optional: limit the key to the site

The `apiKey` from step 2 only identifies the project, but you can stop other sites using it:
in the [Google Cloud console](https://console.cloud.google.com/apis/credentials) for the same project, open
**Browser key (auto created by Firebase)**, set **Application restrictions → Websites**, and add
`https://hosam9988.github.io/*` and `http://localhost:4200/*`.

## Free-plan limits

On Spark, the database allows 50,000 reads a day (opening a name's page is one read), 20,000 writes a day
and 1 GiB of data. If a daily limit is ever reached, that service pauses until the next day; nothing is
charged. Firebase's own usage page shows how much is used.
