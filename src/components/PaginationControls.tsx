"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    className?: string;
};

function generatePagination(
    currentPage: number,
    totalPages: number,
    siblingCount = 1
): (number | "ellipsis")[] {
    const maxVisible = siblingCount * 2 + 5;

    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 2);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
        const leftCount = siblingCount * 2 + 3;
        const left = Array.from({ length: leftCount }, (_, i) => i + 1);
        return [...left, "ellipsis", totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
        const rightCount = siblingCount * 2 + 3;
        const right = Array.from(
            { length: rightCount },
            (_, i) => totalPages - rightCount + i + 1
        );
        return [1, "ellipsis", ...right];
    }

    const middle = Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i
    );
    return [1, "ellipsis", ...middle, "ellipsis", totalPages];
}

export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    const pages = generatePagination(currentPage, totalPages, siblingCount);
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handleClick = (e: React.MouseEvent, page: number) => {
        e.preventDefault();
        if (page === currentPage) return;
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Pagination className={cn("mt-10", className)}>
            <PaginationContent className="flex flex-wrap items-center justify-center gap-1.5">
                {/* Previous */}
                <PaginationItem>
                    <button
                        type="button"
                        onClick={(e) => canGoPrev && handleClick(e, currentPage - 1)}
                        disabled={!canGoPrev}
                        className={cn(
                            "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                            "hover:bg-slate-100 hover:text-slate-900",
                            !canGoPrev && "pointer-events-none opacity-40"
                        )}
                        aria-label="Go to previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>
                </PaginationItem>

                {/* Page numbers + ellipsis */}
                {pages.map((page, index) => (
                    <PaginationItem key={`${page}-${index}`}>
                        {page === "ellipsis" ? (
                            <PaginationEllipsis />
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => handleClick(e, page)}
                                aria-label={`Go to page ${page}`}
                                aria-current={page === currentPage ? "page" : undefined}
                                className={cn(
                                    "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors",
                                    page === currentPage
                                        ? "bg-[#B15A36] text-white hover:bg-[#9a4e2e]"
                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                {page}
                            </button>
                        )}
                    </PaginationItem>
                ))}

                {/* Next */}
                <PaginationItem>
                    <button
                        type="button"
                        onClick={(e) => canGoNext && handleClick(e, currentPage + 1)}
                        disabled={!canGoNext}
                        className={cn(
                            "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                            "hover:bg-slate-100 hover:text-slate-900",
                            !canGoNext && "pointer-events-none opacity-40"
                        )}
                        aria-label="Go to next page"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}