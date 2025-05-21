import { useState, useEffect, useMemo } from "react";
import { Range, getTrackBackground } from "react-range";
import debounce from "lodash.debounce";

const SLIDER_COLORS = {
    track: "#0F172A22",
    fill: "#088D9A",
};

const THUMB_STYLE =
    "relative z-10 w-6 h-6 bg-[#088D9A] rounded-full border border-slate-900/50 cursor-pointer";

export default function FilterSliders({ filters, onFilterChange }) {
    const [localPrice, setLocalPrice] = useState([
        filters.minPrice ?? 0,
        filters.maxPrice ?? 10000,
    ]);
    const [localGuests, setLocalGuests] = useState([filters.minGuests ?? 1]);

    const debouncedPriceChange = useMemo(
        () =>
            debounce((values) => {
                onFilterChange({
                    ...filters,
                    minPrice: values[0],
                    maxPrice: values[1],
                });
            }, 300),
        [filters, onFilterChange]
    );

    const debouncedGuestsChange = useMemo(
        () =>
            debounce((values) => {
                onFilterChange({
                    ...filters,
                    minGuests: values[0],
                });
            }, 300),
        [filters, onFilterChange]
    );

    const handlePriceChange = (values) => {
        setLocalPrice(values);
        debouncedPriceChange(values);
    };

    const handleGuestsChange = (values) => {
        setLocalGuests(values);
        debouncedGuestsChange(values);
    };

    useEffect(() => {
        setLocalPrice([filters.minPrice ?? 0, filters.maxPrice ?? 10000]);
    }, [filters.minPrice, filters.maxPrice]);

    useEffect(() => {
        setLocalGuests([filters.minGuests ?? 1]);
    }, [filters.minGuests]);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-semibold mb-2">Price Range</h2>
                <div className="px-2">
                    <Range
                        values={localPrice}
                        step={100}
                        min={0}
                        max={10000}
                        onChange={handlePriceChange}
                        renderTrack={({ props, children }) => {
                            const { key, ...rest } = props;
                            return (
                                <div
                                    key={key}
                                    {...rest}
                                    className="h-2 rounded w-full"
                                    style={{
                                        background: getTrackBackground({
                                            values: localPrice,
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
                            const { key, ...rest } = props;
                            return (
                                <div
                                    key={key}
                                    {...rest}
                                    className={THUMB_STYLE}
                                />
                            );
                        }}
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>{localPrice[0]} $</span>
                        <span>{localPrice[1]} $</span>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="font-semibold mb-2">Minimum Guests</h2>
                <div className="px-2">
                    <Range
                        values={localGuests}
                        step={1}
                        min={1}
                        max={100}
                        onChange={handleGuestsChange}
                        renderTrack={({ props, children }) => {
                            const { key, ...rest } = props;
                            return (
                                <div
                                    key={key}
                                    {...rest}
                                    className="h-2 rounded w-full"
                                    style={{
                                        background: getTrackBackground({
                                            values: localGuests,
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
                            const { key, ...rest } = props;
                            return (
                                <div
                                    key={key}
                                    {...rest}
                                    className={THUMB_STYLE}
                                />
                            );
                        }}
                    />
                    <div className="text-sm text-gray-600 mt-2">
                        {localGuests[0]} Guests
                    </div>
                </div>
            </div>
        </div>
    );
}
