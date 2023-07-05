import React from "react";
import style from "./Input.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RxCheck } from "react-icons/rx";

//Props types
interface Props {
  key: string;
  value: string;
  onChangeHandler?: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
  valid?: boolean;
  type: string;
  id: string;
  label: string;
  optionaly?: boolean;
  disabled?: boolean;
  errorMessage?: string;
}
const Input: React.FC<Props> = ({
  value,
  onChangeHandler,
  valid,
  type,
  id,
  label,
  optionaly,
  disabled,
  errorMessage,
}) => {
  return (
    <>
      <div className={style.box}>
        {/*Display label*/}
        <label className={style.label} htmlFor={id}>
          {label}
          {/*If optionaly is true then display message that option is optionaly*/}
          {optionaly ? (
            <span className={style.notRequired}>(Opcionalne)</span>
          ) : (
            <></>
          )}
          :
        </label>

        {/*If type is 'tel' then before number display +48*/}
        {type === "tel" ? (
          <span className={style.phonePrefix}>+48</span>
        ) : (
          <></>
        )}

        <input
          className={type === "tel" ? style.phoneInput : style.regularInput}
          type={type}
          id={id}
          value={value}
          onChange={
            onChangeHandler
              ? (e) => {
                  onChangeHandler(e, id);
                }
              : () => {}
          }
          disabled={disabled ? true : false}
        />

        {/*Displaying validate icons*/}
        {/*If disable is true that mean this input is readonly, then dont display validate icons*/}
        {disabled ? (
          <></>
        ) : (
          <>
            {/*If value length is 0 then dont display validate icons*/}
            {/*Create to make UI more clean*/}
            {value.length === 0 ? (
              <></>
            ) : (
              <>
                {valid ? (
                  <div className={style.status}>
                    <RxCheck size={24} color={"#237804"} />
                  </div>
                ) : (
                  <div className={style.status}>
                    <AiOutlineCloseCircle size={24} color={"#820014"} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/*If value length is 0 then dont display validate message*/}
      {/*Create to make UI more clean*/}
      {value.length === 0 ? (
        <></>
      ) : (
        <>
          {!valid ? (
            <div data-testid="error" className={style.error}>
              {errorMessage}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default Input;
