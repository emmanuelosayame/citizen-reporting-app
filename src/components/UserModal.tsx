import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { auth } from "../firebase";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { LoadingBlur } from "./Loading";

const UserModal = ({ onCloseLogin }: { onCloseLogin: () => void }) => {
  const [page, setPage] = useState("UserModal");

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("enter a valid email").required("enter email"),
    password: Yup.string()
      .min(4, "enter a valid password")
      .max(30, "")
      .required("enter password"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const [
    createUserWithEmailAndPassword,
    createdUser,
    createdLoadng,
    createdError,
  ] = useCreateUserWithEmailAndPassword(auth);

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (user) onCloseLogin();
  }, [user]);

  if (createdLoadng || loading) return <LoadingBlur />;

  return (
    <>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton color='medium' onClick={onCloseLogin}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle slot='end' size='large'>
            {page === "register"
              ? "Create an account"
              : "Login To Your Account"}
          </IonTitle>
          <IonButtons slot='end'></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        {page === "register" ? (
          <>
            <Formik
              initialValues={{ email: "", password: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                try {
                  createUserWithEmailAndPassword(values.email, values.password);
                } catch (err) {
                  console.log(err);
                }
              }}>
              {({ values, handleChange, handleBlur }) => (
                <Form>
                  <IonItem>
                    <IonLabel position='floating'>E-mail</IonLabel>
                    <IonInput
                      placeholder='Enter email'
                      type='email'
                      name='email'
                      onBlur={handleBlur}
                      value={values.email}
                      onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position='floating'>Password</IonLabel>
                    <IonInput
                      placeholder='Enter password'
                      type='password'
                      name='password'
                      onBlur={handleBlur}
                      value={values.password}
                      onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position='floating'>Confirm password</IonLabel>
                    <IonInput
                      placeholder='Confirm password'
                      type='password'
                      name='confirmPassword'
                      onBlur={handleBlur}
                      value={values.confirmPassword}
                      onIonChange={handleChange}></IonInput>
                  </IonItem>
                  {/* <IonButtons> */}
                  <IonButton expand='block' size='large' type='submit'>
                    CREATE ACCOUNT
                  </IonButton>
                </Form>
              )}
            </Formik>

            <IonButton fill='clear' onClick={() => setPage("login")}>
              Already have an account?
            </IonButton>
          </>
        ) : (
          <>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                try {
                  signInWithEmailAndPassword(values.email, values.password);
                } catch (err) {
                  console.log(err);
                }
              }}>
              {({ values, handleChange, handleBlur }) => (
                <Form>
                  <IonItem>
                    <IonLabel position='floating'>E-mail</IonLabel>
                    <IonInput
                      placeholder='Enter email'
                      type='email'
                      name='email'
                      onBlur={handleBlur}
                      value={values.email}
                      onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position='floating'>Password</IonLabel>
                    <IonInput
                      placeholder='Enter password'
                      type='password'
                      name='password'
                      onBlur={handleBlur}
                      value={values.password}
                      onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonButton expand='block' size='large' type='submit'>
                    LOGIN
                  </IonButton>
                </Form>
              )}
            </Formik>
            <IonButton fill='clear' onClick={() => setPage("register")}>
              Create an account?
            </IonButton>
          </>
        )}
      </IonContent>
    </>
  );
};

export default UserModal;
