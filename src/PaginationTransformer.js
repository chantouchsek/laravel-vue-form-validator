import BaseTransformer from './BaseTransformer'
import snakecaseKeys from 'snakecase-keys'

class PaginationTransformer extends BaseTransformer {
  static fetch(meta = {}) {
    if (!Object.prototype.hasOwnProperty.call(meta, 'pagination')) {
      return snakecaseKeys(meta, { deep: true })
    }
    const { pagination = {}, include } = meta
    return {
      perPage: pagination.per_page,
      totalPages: pagination.total_pages,
      currentPage: pagination.current_page,
      total: pagination.total,
      links: pagination.links,
      count: pagination.count,
      page: pagination.current_page,
      itemsPerPage: pagination.per_page,
      pageCount: pagination.total_pages,
      itemsLength: pagination.total,
      pageStart: 0,
      pageStop: pagination.count,
      include,
    }
  }
}

export default PaginationTransformer
