
// Provides a typed implementation of Source lists

/**
 * A (non-homogeneous) pair data type with a head and a tail element.
 * @template H type of head element
 * @template T type of tail element
 */
export type Pair<H, T> = [H, T];


/**
 * A homogeneous list.
 * @template T type of all elements in list
 */
export type List<T> = null | [T, List<T>];


/**
 * Construct a pair.
 * @template H the type of the head
 * @template T the type of the tail
 * @param hd head (first component)
 * @param tl tail (second component)
 * @returns Returns a pair whose head is hd and whose tail is y.
 */
export function pair<H, T>(hd: H, tl: T): Pair<H, T> {
	  return [hd, tl];
}


/**
 * Retrieve the head element from a pair.
 * @param p input pair
 * @returns Returns the head (first component) of pair p.
 */
export function head<H, T>(p: Pair<H, T>): H {
	  return p[0];
}


/**
 * Retrieve the tail element from a pair.
 * @param p input pair
 * @returns Returns the tail (second component) of pair p.
 */
export function tail<H, T>(p: Pair<H, T>): T {
	  return p[1];
}


/**
 * Check whether a value is null.
 * @param v value to check
 * @returns Returns true if v is equal to null (using ===).
 */
export function is_null(v: any): v is null {
	  return v === null;
}


/**
 * Create a list from an array.
 * @template S the element type of the new list
 * @param elements An array of values
 * @returns Returns a new list whose values are 
 * the same as in the elements array
 *     (in the same order).
 */
export function list<S>(...elements: Array<S>): List<S> {
    let lst: List<S> = null
    for (let i = elements.length - 1; i >= 0; i = i - 1) {
        lst = pair(elements[i], lst);
    }
    return lst;
}


/**
 * The empty list of a given type.
 * Convenience function.
 * @template T the element type
 * @returns the empty list of type T
 */
export function empty_list<T>(): List<T> {
    return null;
}


/**
 * Give a string representation of a list
 * @template T the element type of the list
 * @param xs the list
 * @returns a string representation of xs
 */
export function to_string<T>(xs: List<T>): string {
    function print(s: Pair<T, List<T>>): string {
      const tl = tail(s);
      return is_null(tl)
             ? head(s) + ""
             : head(s) + ", " + print(tl);
    }
    if (xs === null) {
        return "list()";
    } else {
        return "list(" + print(xs) + ")";
    }
}





















