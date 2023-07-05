import React, { useEffect, useState } from "react";
import style from "./Register.module.scss";
import {
  useEmailValid,
  useNipValid,
  usePasswordValid,
  usePhoneValid,
} from "../../hooks/valid";
import Position from "../Form/Position/Position";
import Input from "../Form/Input/Input";
import { Value, Valid } from "../../modules";
import { Dispatch } from "redux";
import { RootActions } from "../../Redux/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../Redux/Reducers/datas";

//Props type
interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const Register: React.FC<Props> = ({ setStep }) => {
  //Set reducer dispatch and useSelector
  const newValue: Value = useSelector(
    (state: { datas: State }) => state.datas.datas
  );
  const newValid: Valid = useSelector(
    (state: { datas: State }) => state.datas.valid
  );
  const dispatch = useDispatch<Dispatch<RootActions>>();

  //Create stete value which are imported from redux. Difauld ""
  const [value, setValue] = useState<Value>({
    email: newValue.email,
    password: newValue.password,
    repPassword: newValue.repPassword,
    nip: newValue.nip,
    phone: newValue.phone,
    position: newValue.position,
  });

  //Create a valid state that is responsible for holding a boolean value indicating whether the data is correct
  const [valid, setValid] = useState<Valid>({
    email: newValid.email,
    password: newValid.password,
    repPassword: newValid.repPassword,
    nip: newValid.nip,
    phone: newValid.phone,
    position: newValid.position,
  });

  //Return boolean value true if all elements in state valid{} are true
  const [readyToSet, setReadyToSet] = useState<boolean>(false);
  useEffect(() => {
    if (
      valid.email === true &&
      valid.nip === true &&
      valid.password === true &&
      valid.phone === true &&
      valid.position === true &&
      valid.repPassword === true
    ) {
      setReadyToSet(true);
    } else {
      setReadyToSet(false);
    }
  }, [valid]);

  //Using hooks from /src/hooks/valid.ts
  const emailValid: (email: string) => RegExpMatchArray | null =
    useEmailValid();
  const passwordValid: (pass: string) => boolean = usePasswordValid();
  const [phoneValid, phoneTransform]: [
    (value: string) => boolean,
    (phone: string, initialPhone: string) => string
  ] = usePhoneValid();
  const [nipValid, nipTransform]: [
    (value: string) => boolean,
    (nip: string) => string
  ] = useNipValid();

  //After using onChange in a form input, this function returns a value that is checked by the 'type' to determine which part of the switch statement should be executed
  //Next, the states value and valid are set for the correct values
  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ): void => {
    e.preventDefault();
    switch (type) {
      case "email":
        if (emailValid(e.target.value)) {
          setValid({ ...valid, email: true });
        } else {
          setValid({ ...valid, email: false });
        }
        setValue({ ...value, email: e.target.value });
        break;

      case "password":
        const isValidPassword = passwordValid(e.target.value);
        const isValidRepPassword = value.repPassword === e.target.value;

        setValue({ ...value, password: e.target.value });

        setValid({
          ...valid,
          password: isValidPassword,
          repPassword: isValidRepPassword,
        });
        break;

      case "repPassword":
        if (value.password !== e.target.value) {
          setValid({ ...valid, repPassword: false });
        } else {
          setValid({ ...valid, repPassword: true });
        }
        setValue({ ...value, repPassword: e.target.value });
        break;

      case "phone":
        setValue({
          ...value,
          phone: phoneTransform(e.target.value, value.phone),
        });
        if (phoneValid(phoneTransform(e.target.value, value.phone))) {
          setValid({ ...valid, phone: true });
        } else {
          setValid({ ...valid, phone: false });
        }
        break;

      case "nip":
        setValue({ ...value, nip: nipTransform(e.target.value) });
        if (nipValid(nipTransform(e.target.value))) {
          setValid({ ...valid, nip: true });
        } else {
          setValid({ ...valid, nip: false });
        }
        break;

      case "radio":
        setValue({ ...value, position: e.target.value });
        setValid({ ...valid, position: true });
        break;
    }
  };

  //The submit function is executed after completing the form
  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    //if all input are valid then set reducer and go to nex step
    if (readyToSet) {
      await dispatch({ type: "getDatas", datas: value, valid: valid });
      await setStep(1);
    }
  };

  return (
    <>
      <div className={style.main}>
        <form onSubmit={submit} className={style.container}>
          {/*Title*/}
          <div className={style.title}>Rejestracja</div>

          {/*E-mail input*/}
          <Input
            key={"email"}
            value={value.email} //value from state
            onChangeHandler={onChangeHandler} //onChangeHandler function to update value and valid
            valid={valid.email} //State variable to hold the value indicating whether this input value is correct
            type={"text"} //input type
            id={"email"} //input id
            label={"E-mail"} //name display upper the input
            errorMessage={"Niroporawny e-mail"}
          />

          {/*Password*/}
          <Input
            key={"password"}
            value={value.password}
            onChangeHandler={onChangeHandler}
            valid={valid.password}
            type={"password"}
            id={"password"}
            label={"Hasło"}
            errorMessage={
              "Hasło musi być dłuższe niż 8 znaków i musi zawierać zawierać: DUŻĄ i małą literę, znak specialny oraz conajmniej jedną cyfrę"
            }
          />

          {/*Repete password*/}
          <Input
            key={"repPassword"}
            value={value.repPassword}
            onChangeHandler={onChangeHandler}
            valid={valid.repPassword}
            type={"password"}
            id={"repPassword"}
            label={"Powtórz hasło"}
            errorMessage={"Hasła nie są takie same"}
          />

          {/*NIP*/}
          <Input
            key={"nip"}
            value={value.nip}
            onChangeHandler={onChangeHandler}
            valid={valid.nip}
            type={"text"}
            id={"nip"}
            label={"NIP"}
            errorMessage={"Niepoprawny NIP"}
          />

          {/*Phone number*/}
          <Input
            key={"phone"}
            value={value.phone}
            onChangeHandler={onChangeHandler}
            valid={valid.phone}
            type={"tel"}
            id={"phone"}
            label={"Numer telefonu"}
            optionaly={true} //if this value is true then that option isnt required
            errorMessage={"Niepoprawny numer telefonu"}
          />

          {/*Pick position*/}
          <div className={style.box}>
            <label className={style.label}>Stanowisko:</label>
            <div className={style.position}>
              {[
                "Administrator",
                "Dyrektor",
                "Inspektor",
                "Kierownik",
                "Księgowy",
                "Pełnomocnik",
              ].map((e) => (
                <Position
                  key={e}
                  value={e}
                  current={value.position}
                  onChangeHandler={(event) => onChangeHandler(event, "radio")}
                />
              ))}
            </div>
          </div>

          {/*If all boolean values from state valid arent true then disable the button*/}
          {readyToSet ? (
            <button data-testid="success" className={style.button}>
              Zarejestruj
            </button>
          ) : (
            <div className={style.buttonDisable}>Podaj dane</div>
          )}
        </form>
      </div>
    </>
  );
};

export default Register;
