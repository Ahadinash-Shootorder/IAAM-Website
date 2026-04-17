"use client";

export default function SpecificationTable({ data }) {
  let specs = [];

  try {
    if (typeof data === "string") {
      specs = JSON.parse(data);
    } else if (Array.isArray(data)) {
      specs = data;
    }
  } catch {
    return null;
  }

  if (!Array.isArray(specs) || specs.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4">
              Model
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/3">
              Specification
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/3">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {spec.model || "-"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {spec.key}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
