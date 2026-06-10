import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TopBar from "@/components/TopBar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/lib/use-auth", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    },
    logout: vi.fn(),
  }),
}));

describe("TopBar - Authenticated", () => {
  it("shows user menu when authenticated", () => {
    render(<TopBar />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.queryByText("登录")).not.toBeInTheDocument();
  });

  it("opens dropdown menu on click", () => {
    render(<TopBar />);

    const userButton = screen.getByText("Test User").closest("button");
    fireEvent.click(userButton!);

    expect(screen.getByText("个人主��")).toBeInTheDocument();
    expect(screen.getByText("账号��理")).toBeInTheDocument();
    expect(screen.getByText("���出登录")).toBeInTheDocument();
  });
});
