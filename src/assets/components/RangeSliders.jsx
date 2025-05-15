import { Range, getTrackBackground } from "react-range";

const SLIDER_COLORS = {
    track: "#0F172A22",
    fill: "#088D9A",
};

const THUMB_STYLE =
    "w-6 h-6 bg-[#088D9A] rounded-full border border-slate-900/50 cursor-pointer";

export default function FilterSliders({ filters, onFilterChange }) {
    const handlePriceChange = (values) => {
        onFilterChange({
            ...filters,
            minPrice: values[0],
            maxPrice: values[1],
        });
    };

    const handleGuestsChange = (values) => {
        onFilterChange({
            ...filters,
            minGuests: values[0],
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-semibold mb-2">Price Range</h2>
                <div className="px-2">
                    <Range
                        values={[
                            filters.minPrice ?? 0,
                            filters.maxPrice ?? 10000,
                        ]}
                        step={100}
                        min={0}
                        max={10000}
                        onChange={handlePriceChange}
                        renderTrack={({ props, children }) => {
                            const { key, ...restProps } = props;
                            return (
                                <div
                                    key={key}
                                    {...restProps}
                                    className="h-2 rounded w-full"
                                    style={{
                                        background: getTrackBackground({
                                            values: [
                                                filters.minPrice ?? 0,
                                                filters.maxPrice ?? 10000,
                                            ],
                                            colors: [
                                                SLIDER_COLORS.track,
                                                SLIDER_COLORS.fill,
                                                SLIDER_COLORS.track,
                                            ],
                                            min: 0,
                                            max: 10000,
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            );
                        }}
                        renderThumb={({ props }) => {
                            const { key, ...restProps } = props;
                            return (
                                <div
                                    key={key}
                                    {...restProps}
                                    className={THUMB_STYLE}
                                />
                            );
                        }}
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>{filters.minPrice ?? 0} NOK</span>
                        <span>{filters.maxPrice ?? 10000} NOK</span>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="font-semibold mb-2">Minimum Guests</h2>
                <div className="px-2">
                    <Range
                        values={[filters.minGuests ?? 1]}
                        step={1}
                        min={1}
                        max={100}
                        onChange={handleGuestsChange}
                        renderTrack={({ props, children }) => {
                            const { key, ...restProps } = props;
                            return (
                                <div
                                    key={key}
                                    {...restProps}
                                    className="h-2 rounded w-full"
                                    style={{
                                        background: getTrackBackground({
                                            values: [filters.minGuests ?? 1],
                                            colors: [
                                                SLIDER_COLORS.fill,
                                                SLIDER_COLORS.track,
                                            ],
                                            min: 1,
                                            max: 100,
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            );
                        }}
                        renderThumb={({ props }) => {
                            const { key, ...restProps } = props;
                            return (
                                <div
                                    key={key}
                                    {...restProps}
                                    className={THUMB_STYLE}
                                />
                            );
                        }}
                    />
                    <div className="text-sm text-gray-600 mt-2">
                        {filters.minGuests ?? 1} Guests
                    </div>
                </div>
            </div>
        </div>
    );
}
