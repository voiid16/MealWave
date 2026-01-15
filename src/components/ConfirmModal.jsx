import React from "react";

export function ConfirmModal({ open, title = "Are you sure?", confirmMessage = "Remove", onConfirm, onClose }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-background-main rounded-xl shadow-lg w-100 max-w-[90%] p-5">
                <h2 className="text-base font-semibold text-title mb-6">{title}</h2>
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 text-sm rounded-md bg-[#eb6424] text-white/90 hover:cursor-pointer"
                        onClick={() => { onConfirm(); onClose(); }}
                    >
                        {confirmMessage}
                    </button>
                </div>
            </div>
        </div>
    );
}
