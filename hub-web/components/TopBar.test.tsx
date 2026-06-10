import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TopBar from "@/components/TopBar";

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock auth hook
vi.mock("@/lib/use-auth", () => ({
  useAuth: () => ({
    user: null,
    logout: vi.fn(),
  }),
}));

describe("TopBar", () => {
  it("renders logo and navigation links", () => {
    render(<TopBar />);

    expect(screen.getByText("NPU Bench")).toBeInTheDocument();
    expect(screen.getByText("��页")).toBeInTheDocument();
    expect(screen.getByText("模型���")).toBeInTheDocument();
    expect(screen.getByText("排行��")).toBeInTheDocument();
    expect(screen.getByText("文���")).toBeInTheDocument();
  });

  it("shows login and register buttons when not authenticated", () => {
    render(<TopBar />);

    expect(screen.getByText("��录")).toBeInTheDocument();
    expect(screen.getByText("注册")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<TopBar />);

    const searchInput = screen.getByPlaceholderText("搜���模型...");
    expect(searchInput).toBeInTheDocument();
  });
});
