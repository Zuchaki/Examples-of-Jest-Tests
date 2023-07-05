import React from "react";
import {
  fireEvent,
  getByLabelText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Register from "../Components/Register/Register";
import rootReducer from "../Redux/rootReducer";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// Mock the useDispatch hook
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

describe("In Register component", () => {
  it("the correct registration module is displayed with the text 'Rejestracja' at the top", () => {
    const setStep = jest.fn();
    const store = createStore(rootReducer);

    render(
      <Provider store={store}>
        <Register setStep={setStep} />
      </Provider>
    );
    const linkElement = screen.getByText(/Rejestracja/i);
    expect(linkElement).toBeInTheDocument();
  });
  it("inputs are exist", () => {
    const setStep = jest.fn();
    const store = createStore(rootReducer);

    render(
      <Provider store={store}>
        <Register setStep={setStep} />
      </Provider>
    );

    const emailInput = screen.queryByLabelText(/E-mail/i);
    expect(emailInput).toBeInTheDocument();

    const passwordElement = screen.getAllByText(/Hasło/i);
    expect(passwordElement.length).toBeGreaterThan(1);

    const nipInput = screen.queryByLabelText(/NIP/i);
    expect(nipInput).toBeInTheDocument();

    const telInput = screen.queryByLabelText(/Numer telefonu/i);
    expect(telInput).toBeInTheDocument();
  });

  it("I can enter values into the inputs", () => {
    const setStep = jest.fn();
    const store = createStore(rootReducer);

    render(
      <Provider store={store}>
        <Register setStep={setStep} />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/E-mail/i);
    expect(emailInput).toHaveValue("");

    const passwordInput = screen.getAllByLabelText(/Hasło/i);
    expect(passwordInput[0]).toHaveValue("");

    const repPasswordInput = screen.getByLabelText(/Powtórz hasło/i);
    expect(repPasswordInput).toHaveValue("");

    const nipInput = screen.getByLabelText(/NIP/i);
    expect(nipInput).toHaveValue("");

    const telInput = screen.getByLabelText(/Numer telefonu/i);
    expect(telInput).toHaveValue("");

    fireEvent.change(emailInput, { target: { value: "www@de.pl" } });
    expect(emailInput).toHaveValue("www@de.pl");

    fireEvent.change(passwordInput[0], { target: { value: "12345678" } });
    expect(passwordInput[0]).toHaveValue("12345678");

    fireEvent.change(repPasswordInput, { target: { value: "12345678" } });
    expect(repPasswordInput).toHaveValue("12345678");

    fireEvent.change(telInput, { target: { value: "453543543" } });
    expect(telInput).toHaveValue("453 543 543");

    fireEvent.change(nipInput, { target: { value: "1234567890" } });
    expect(nipInput).toHaveValue("123-456-78-90");
  });

  it("should display errors after entering invalid data", async () => {
    const setStep = jest.fn();
    const store = createStore(rootReducer);

    render(
      <Provider store={store}>
        <Register setStep={setStep} />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getAllByLabelText(/Hasło/i);
    const repPasswordInput = screen.getByLabelText(/Powtórz hasło/i);
    const nipInput = screen.getByLabelText(/NIP/i);

    fireEvent.change(emailInput, { target: { value: "www" } });
    await waitFor(() => {
      expect(screen.queryAllByTestId("error")).toHaveLength(1);
    });
    await waitFor(() => {
      expect(screen.queryAllByTestId("error").length).not.toBeGreaterThan(1);
    });

    fireEvent.change(passwordInput[0], { target: { value: "123" } });
    await waitFor(() => {
      expect(screen.queryAllByTestId("error")).toHaveLength(2);
    });
    await waitFor(() => {
      expect(screen.queryAllByTestId("error").length).not.toBeGreaterThan(2);
    });

    fireEvent.change(repPasswordInput, { target: { value: "1233" } });
    await waitFor(() => {
      expect(screen.queryAllByTestId("error")).toHaveLength(3);
    });
    await waitFor(() => {
      expect(screen.queryAllByTestId("error").length).not.toBeGreaterThan(3);
    });

    fireEvent.change(nipInput, { target: { value: "123456" } });
    await waitFor(() => {
      expect(screen.queryAllByTestId("error")).toHaveLength(4);
    });
    await waitFor(() => {
      expect(screen.queryAllByTestId("error").length).not.toBeGreaterThan(4);
    });
  });
  it("should the text on the button change after entering valid data", async () => {
    const setStep = jest.fn();
    const store = createStore(rootReducer);

    render(
      <Provider store={store}>
        <Register setStep={setStep} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("success")).not.toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getAllByLabelText(/Hasło/i);
    const repPasswordInput = screen.getByLabelText(/Powtórz hasło/i);
    const nipInput = screen.getByLabelText(/NIP/i);
    const radioInput = screen.getByLabelText("Administrator");

    fireEvent.change(emailInput, { target: { value: "www@ww.pl" } });
    fireEvent.change(passwordInput[0], { target: { value: "ZAQ!1qaz" } });
    fireEvent.change(repPasswordInput, { target: { value: "ZAQ!1qaz" } });
    fireEvent.change(nipInput, { target: { value: "1234567890" } });
    fireEvent.click(radioInput);

    await waitFor(() => {
      expect(screen.getByTestId("success")).toBeInTheDocument();
    });
  });
});
