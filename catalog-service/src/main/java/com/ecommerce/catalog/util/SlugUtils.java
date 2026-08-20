package com.ecommerce.catalog.util;

import java.util.Locale;

public final class SlugUtils {

    private SlugUtils() {
    }

    public static String slugify(String value) {
        if (value == null || value.isBlank()) {
            return "item";
        }

        return value.toLowerCase(Locale.ROOT)
                .replace("&", "and")
                .replace("'", "")
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}
