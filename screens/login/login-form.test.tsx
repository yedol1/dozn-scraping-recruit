import LoginForm from "./login-form";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

describe("Login Form", () => {
  test("render correct", () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    expect(
      screen.getByPlaceholderText("이메일을 입력해주세요.")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("비밀번호를 입력해주세요.")
    ).toBeInTheDocument();
  });

  test("submits form with email and password", async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요.");
    const passwordInput =
      screen.getByPlaceholderText("비밀번호를 입력해주세요.");
    const button = screen.getByRole("button");

    fireEvent.change(emailInput, {
      target: { value: "user@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "1q2w3e4r5t!" },
    });

    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("1q2w3e4r5t!");

    fireEvent.submit(button);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
